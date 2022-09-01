const User = require('../models/User');
const RegisteredCourses = require('../models/RegisteredCourses');
const Course = require('../models/Course');
const mongoose = require('mongoose');
const {
  validateRegisterInputs,
  validateLoginInputs,
  validateUpdateInputs,
} = require('../validation/userValidation');
const bcrypt = require('bcryptjs');
module.exports = {
  // @route          POST /user/create
  // @description    Add new user with different roles (1 => admin) (0 => student)
  // @access         Public
  createUser: async (req, res) => {
    const { errors, isValid } = validateRegisterInputs(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    const userData = {
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
    };

    try {
      const isExist = await User.findOne({
        $or: [
          ({ email: req.body.email },
          {
            phone: req.body.phone,
          }),
        ],
      });
      if (isExist && isExist.email === req.body.email) {
        errors.email = 'Email is already exist';
        return res.status(400).json({ success: false, errors });
      }
      if (isExist && isExist.phone === req.body.phone) {
        errors.phone = 'Phone is already exist';
        return res.status(400).json({ success: false, errors });
      }
      const user = new User(userData);
      await user.save();
      res.json({
        message: 'Successfully added new user',
        success: true,
        user,
      });
    } catch (error) {
      res.send(error);
    }
  },
  // @route          POST /user/login
  // @description    Login with  email&password
  // @access         Public
  loginUser: async (req, res) => {
    const { email, password } = req.body;
    const { errors, isValid } = validateLoginInputs(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        errors.email = "Email doesn't exist, Please try again";

        return res.status(404).json({
          success: false,
          errors,
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        errors.password = 'Wrong passowrd, Please try again';
        return res.status(400).json({
          success: false,
          errors,
        });
      }

      const token = await user.generateAuthToken();
      res.status(202).json({ user, token });
    } catch (error) {
      console.log(error);
    }
  },
  // @route          POST /user/logout
  // @description    Logout from session set token = ''
  // @access         Private
  logoutUser: async (req, res) => {
    try {
      req.user.token = '';
      await req.user.save();
      res.json({
        success: true,
        message: 'Logout successfully',
      });
    } catch (e) {
      res.status(500).json({ success: false, error: e });
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.find();

      res.json({ users });
    } catch (error) {
      console.log(error);
    }
  },
  // @route          GET /user/profile/(me | id)
  // @description    Show my profile(current user login)
  // @access         Private
  profileUser: async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.json({ success: false, messsage: 'not found' });
    }
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'NOT FOUND' });
      }
      return res.json({ profile: user });
    } catch (error) {
      res.send(error);
    }
  },
  // @route          GET /user/profile/me
  // @description    Show my profile(current user login)
  // @access         Private
  currentProfile: async (req, res) => {
    return res.json({ profile: req.user });
  },
  // @route          PATCH /user/update/(me | id)
  // @description    Update email , password or phone
  // @access         Private
  updateUser: async (req, res) => {
    const requestedUpdate = Object.keys(req.body);
    const { errors, isValid } = validateUpdateInputs(req.body);
    if (!isValid) return res.status(400).json({ errors });
    const allowedUpdate = [
      'name',
      'phone',
      'email',
      'role',
      'password',
      'confirmPassword',
    ];

    const isValidOperation = requestedUpdate.every((update) =>
      allowedUpdate.includes(update)
    );
    if (!isValidOperation)
      return res
        .status(400)
        .json({ success: false, message: 'Not supported update' });
    try {
      if (req.params.id === 'me') {
        req.params.id = req.user._id;
        const user = await User.findById(req.params.id);
        if (!user) {
          return res.status(404).json({ success: false, message: 'NOT FOUND' });
        }
        requestedUpdate.forEach((update) => (user[update] = req.body[update]));
        const isExistEmail = await User.findOne({ email: req.body.email });
        const isExistPhone = await User.findOne({ phone: req.body.phone });
        if (
          isExistEmail &&
          isExistEmail._id.toString() !== user._id.toString()
        ) {
          errors.email = 'Email is already exist';
          return res.status(400).json({ success: false, errors });
        }
        if (
          isExistPhone &&
          isExistPhone._id.toString() !== user._id.toString()
        ) {
          errors.phone = 'Phone is already exist';
          return res.status(400).json({ success: false, errors });
        }
        await user.save();
        return res.json({ profile: user });
      }
      if (req.params.id && req.user.role != 0) {
        const user = await User.findById(req.params.id);
        if (!user) {
          return res.status(404).json({ success: false, message: 'NOT FOUND' });
        }
        requestedUpdate.forEach((update) => (user[update] = req.body[update]));
        const isExistEmail = await User.findOne({ email: req.body.email });
        const isExistPhone = await User.findOne({ phone: req.body.phone });
        if (
          isExistEmail &&
          isExistEmail._id.toString() !== user._id.toString()
        ) {
          errors.email = 'Email is already exist';
          return res.status(400).json({ success: false, errors });
        }
        if (
          isExistPhone &&
          isExistPhone._id.toString() !== user._id.toString()
        ) {
          errors.phone = 'Phone is already exist';
          return res.status(400).json({ success: false, errors });
        }
        await user.save();
        return res.json({ profile: user });
      }
      if (req.params.id && req.params.id !== 'me' && req.user.role == 0) {
        return res
          .status(404)
          .json({ success: false, message: 'You are not authenticated' });
      }

      requestedUpdate.forEach(
        (update) => (req.user[update] = req.body[update])
      );
      await req.user.save();
      res.json(req.user);
    } catch (error) {
      console.log(error);
    }
  },
  // @route          DELETE /user/delete/id
  // @description    Delete user by admin only
  // @access         Private
  deleteUser: async (req, res) => {
    const id = req.params.id;
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'NOT FOUND' });
      }
      if (req.user.role !== 1) {
        return res
          .status(402)
          .json({ success: false, message: 'You are not authenticated' });
      }

      return res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
      console.log(error);
    }
  },
  // @route          POST /user/registercourse
  // @description    User Register an course
  // @access         Private

  NumberOfUsers: async (req, res) => {
    try {
      const numberOfUsers = await User.count();
      res.json({ numberOfUsers });
    } catch (error) {
      console.log(error);
    }
  },
  numberOfUsersWhoseRegisteredCourses: async (req, res) => {
    try {
      const numberOfUsersWhoseRegisteredCourses =
        await RegisteredCourses.find().distinct('userId');

      res.json({
        numberOfUsersWhoseRegisteredCourses:
          numberOfUsersWhoseRegisteredCourses.length,
      });
    } catch (error) {}
  },
  getLastFiveUser: async (req, res) => {
    try {
      const lastFiveUsers = await User.find().sort({ createdAt: -1 }).limit(5);
      res.json({ lastFiveUsers });
    } catch (error) {}
  },
  getCourseAndWhoseAssigned: async (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    try {
      const users = await RegisteredCourses.findById({ courseId: id });
      if (users === 0) {
        return res.json({ success: false, message: 'There is no users yet' });
      }

      return res.json({ users });
    } catch (error) {}
  },
  groupUsersBySameDate: async (req, res) => {
    try {
      const analysis = await User.aggregate([
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
      ]);
      analysis.sort(function (a, b) {
        return b._id.month - a._id.month;
      });
      analysis.reverse();
      res.json({ analysis });
    } catch (error) {
      console.log(error);
    }
  },
};
