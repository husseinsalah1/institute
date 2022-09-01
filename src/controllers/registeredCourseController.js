const RegisteredCourses = require('../models/RegisteredCourses');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
module.exports = {
  getCourseAndWhoseAssigned: async (req, res) => {
    console.log(req.params.courseCode);
    try {
      const users = await RegisteredCourses.find({
        courseCode: req.params.courseCode,
      })
        .populate('userId')
        .populate('courseId');
      if (users === 0) {
        return res.json({ success: false, message: 'There is no users yet' });
      }

      return res.json({ users });
    } catch (error) {
      console.log(error);
    }
  },
};
