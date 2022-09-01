const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const registeredCourseController = require('../controllers/registeredCourseController');

router.get(
  '/course/:courseCode',
  auth,
  registeredCourseController.getCourseAndWhoseAssigned
);

module.exports = router;
