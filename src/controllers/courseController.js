const Course = require('../models/Course');
const sharp = require('sharp');
const { validateCourseInput } = require('../validation/courseValidation');
const isEmpty = require('../validation/isEmpty');
const RegisteredCourses = require('../models/RegisteredCourses');
const mongoose = require('mongoose');
module.exports = {
  // @route          POST /course/add
  // @description    add new course by admin only
  // @access         Private
  addCourse: async (req, res) => {
    // Role is Admin or assistance
    if (req.user.role == 0) {
      return res
        .status(400)
        .json({ success: false, message: 'You are not authenticated' });
    }
    const file = req.files;
    const { errors, isValid } = validateCourseInput(req.body, file);
    if (!isValid) return res.status(400).json({ errors });
    var image;
    if (req.files && req.files.image) {
      image = await sharp(req.files.image[0].buffer)
        .resize({ width: 500, height: 500 })
        .png()
        .toBuffer();
    }
    const aboutCourse = req.body.about.trim().split('@');
    const CourseData = {
      name: req.body.name,
      description: req.body.description,
      about: aboutCourse,
      image,
      category: req.body.category,
      hours: req.body.hours,
      duration: req.body.duration,
      classes: req.body.classes,
      price: req.body.price,
      isHasOffer: req.body.isHasOffer,
      offer: req.body.offer,
      endOfferDate: req.body.endOfferDate,
      userId: req.user._id,
      lang: req.body.lang,
      courseCode: req.body.courseCode,
    };

    try {
      const isExist = await Course.findOne({
        name: CourseData.name,
        lang: CourseData.lang,
        courseCode: CourseData.courseCode,
      });
      if (isExist) {
        return res.json({
          sucess: false,
          message: 'This course is already exist',
        });
      }
      const course = new Course(CourseData);
      await course.save();
      res.json({ success: true, message: 'Added course successfully', course });
    } catch (error) {
      res.send(error);
    }
  },
  // @route          GET /course/:id
  // @description    get specific course by id
  // @access         public
  getCourse: async (req, res) => {
    const id = req.params.id;
    try {
      const course = await Course.findById(id);
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: 'Course not found' });
      }
      const convertToObject = course.toObject();

      delete convertToObject['image'];
      res.json({ success: true, course: convertToObject });
    } catch (e) {
      console.log(e);
    }
  },
  // @route          GET /course
  // @description    get all courses
  // @access         public
  getCourses: async (req, res) => {
    const lang = req.query.lang;
    try {
      const courses = await Course.find({ lang })
        .select([
          'name',
          'description',
          'category',
          'about',
          'category',
          'hours',
          'duration',
          'classes',
          'attends',
          'price',
          'isHasOffer',
          'offer',
          'startOfferDate',
          'endOfferDate',
          'createdAt',
          'userId',
          'lang',
          'courseCode',
        ])
        .populate('userId');
      res.json({ courses });
    } catch (error) {
      console.log(error);
    }
  },
  // @route          PATCH /course/:id
  // @description    update course by admin only
  // @access         private

  updateCourse: async (req, res) => {
    const id = req.params.id;
    const requestedUpdate = Object.keys(req.body);
    if (req.user.role == 0) {
      return res.json({ success: false, message: 'You are not authenticated' });
    }
    const { errors, isValid } = validateCourseInput(req.body, 'file');
    if (!isValid) return res.status(400).json({ errors });
    try {
      const course = await Course.findById(id);
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: 'Course not found' });
      }
      const file = req.files;
      let image = course['image'];
      if (file && file.image) {
        image = await sharp(req.files.image[0].buffer)
          .resize({ width: 500, height: 500 })
          .png()
          .toBuffer();
      }
      if (isEmpty(course['offer'])) {
        course['offer'] = 0;
      }

      course['image'] = image;
      requestedUpdate.forEach((update) => {
        if (update === 'image') {
        } else if (update === 'about') {
          const aboutCourse = req.body.about.trim().split('@');
          course[update] = aboutCourse;
        } else {
          course[update] = req.body[update];
        }
      });
      await course.save();
      const convertToObject = course.toObject();
      delete convertToObject.image;
      res.json({
        success: true,
        message: 'updated successfully',
        course: convertToObject,
      });
    } catch (error) {
      console.log(error);
    }
  },
  // @route          DELETE /course/:id
  // @description    delete course by admin only
  // @access         private
  deletCourse: async (req, res) => {
    const courseCode = req.params.courseCode;
    if (req.user.role !== 1) {
      return res.json({ success: false, message: 'You are not authenticated' });
    }
    try {
      const course = await Course.deleteMany({ courseCode });
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: 'Course not found' });
      }
      await RegisteredCourses.findOneAndDelete({
        courseCode,
      });
      return res.json({
        success: true,
        message: `Course Deleted successfully`,
      });
    } catch (error) {}
  },
  image: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course || !course.image) throw new Error();
      res.set('Content-Type', 'image/png');
      res.send(course.image);
    } catch (e) {}
  },
  getCoursesByCategory: async (req, res) => {
    const category = req.params.category;
    try {
      const coursesByCategory = await Course.find({
        category,
        lang: req.query.lang,
      });

      return res.json({ courses: coursesByCategory });
    } catch (e) {}
  },
  numberOfCourses: async (req, res) => {
    try {
      const numberOfCourses = await Course.count({ lang: req.query.lang });
      res.json({ numberOfCourses });
    } catch (error) {
      console.log(error);
    }
  },
  numberOfRegisteredCourses: async (req, res) => {
    try {
      const numberOfRegisteredCourses = await RegisteredCourses.distinct(
        'courseId'
      ).count();
      res.json({ numberOfRegisteredCourses });
    } catch (error) {}
  },
  showRegisteredCourses: async (req, res) => {
    const id = req.params.id;
    try {
      const courses = await RegisteredCourses.find({
        userId: mongoose.Types.ObjectId(id),
      }).populate({
        path: 'courseId',
        model: 'Course',
        select: 'name description category price offer endOfferDate',
      });
      var arr = [];
      for (let i = 0; i < courses.length; i++) {
        const courseLang = await Course.findOne({
          lang: req.query.lang,
          courseCode: courses[i].courseCode,
        });

        if (courseLang) {
          const convertToObject = courseLang.toObject();
          delete convertToObject['image'];
          arr.push(convertToObject);
        }
      }
      res.json({ courses: arr });
    } catch (error) {}
  },
  registerCourse: async (req, res) => {
    const regCourseData = {
      userId: req.user.id,
      courseId: req.body.courseId,
      courseCode: req.body.courseCode,
    };
    try {
      const isExist = await RegisteredCourses.findOne({
        userId: mongoose.Types.ObjectId(regCourseData.userId),
        courseId: mongoose.Types.ObjectId(regCourseData.courseId),
        courseCode: regCourseData.courseCode,
      });
      const checkCourse = await Course.findById(
        mongoose.Types.ObjectId(regCourseData.courseId)
      );
      if (!checkCourse) {
        return res.json({ success: false, message: 'Course is not found' });
      }

      if (isExist) {
        return res.json({
          success: false,
          message: 'You have already registered for this course',
        });
      }
      var langcheck = checkCourse.lang === 'en' ? 'ar' : 'en';

      const otherlang = await Course.findOne({
        courseCode: checkCourse.courseCode,
        lang: langcheck,
      }).select(['attends']);
      otherlang.attends++;
      checkCourse.attends++;
      const registeredCourses = await new RegisteredCourses(regCourseData);
      await otherlang.save();
      await checkCourse.save();
      await registeredCourses.save();
      res.json({ success: true, message: 'Registered successfully' });
    } catch (error) {
      console.log(error);
    }
  },
  cancelRegisteredCourse: async (req, res) => {
    const { courseId } = req.query;

    try {
      const checkCourse = await Course.findById(
        mongoose.Types.ObjectId(courseId)
      );
      if (!checkCourse) {
        return res.json({ success: false, message: 'Course is not found' });
      }
      var langcheck = checkCourse.lang === 'en' ? 'ar' : 'en';
      const otherlang = await Course.findOne({
        courseCode: checkCourse.courseCode,
        lang: langcheck,
      }).select(['attends', 'courseCode']);
      otherlang.attends--;
      checkCourse.attends--;
      await otherlang.save();
      await checkCourse.save();
      await RegisteredCourses.findOneAndDelete({
        courseCode: checkCourse.courseCode,
      });
      return res.json({
        success: true,
        message: 'Course canceled successfully',
      });
    } catch (error) {
      console.log(error);
    }
  },
  lastFiveRegisteredCourses: async (req, res) => {
    try {
      const lastFiveRegisteredCourses = await RegisteredCourses.find()
        .sort({
          date: -1,
        })
        .populate('userId')
        .populate('courseId')
        .limit(5);
      res.json({ lastFiveRegisteredCourses });
    } catch (error) {}
  },
};
