const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const auth = require('../middleware/auth');
const courseController = require('../controllers/courseController');

// Show Registered Courses
router.get(
  '/showregisteredcourses/:id',
  courseController.showRegisteredCourses
);
// Cancel Register Course
router.delete(
  '/cancelregisteredcourse',
  auth,
  courseController.cancelRegisteredCourse
);
// Register Course
router.post('/registercourse', auth, courseController.registerCourse);
// POST Requests
router.post(
  '/add',
  auth,
  upload.fields([
    {
      name: 'image',
      maxCount: 1,
    },
  ]),
  courseController.addCourse
);
router.get('/count', auth, courseController.numberOfCourses);
router.get(
  '/count/registeredCourses',
  auth,
  courseController.numberOfRegisteredCourses
);
router.get('/lastfive', auth, courseController.lastFiveRegisteredCourses);

// GET Requests
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourse);
router.get('/category/:category', courseController.getCoursesByCategory);

// PATCH Requests
router.patch(
  '/update/:id',
  auth,
  upload.fields([
    {
      name: 'image',
      maxCount: 1,
    },
  ]),
  courseController.updateCourse
);

// Delete Requests
router.delete('/delete/:courseCode', auth, courseController.deletCourse);
// GET Image
router.get('/image/:id', courseController.image);
module.exports = router;
