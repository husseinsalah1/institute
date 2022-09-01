const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const userController = require('../controllers/userController');

// POST Requests
router.post('/create', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/logout', auth, userController.logoutUser);
// GET Requets
router.get('/profile/me', auth, userController.currentProfile);
router.get('/userprofile/:id', auth, userController.profileUser);
router.get('/', auth, userController.getUsers);
router.get('/count', auth, userController.NumberOfUsers);
router.get(
  '/count/numberOfUsersWhoseRegisteredCourses',
  auth,
  userController.numberOfUsersWhoseRegisteredCourses
);
router.get('/lastfive', userController.getLastFiveUser);
router.get('/course/:id', auth, userController.getCourseAndWhoseAssigned);
// PATCH Requets
router.get('/update/me', auth, userController.updateUser);
router.patch('/update/:id', auth, userController.updateUser);
// DELETE Requets
router.delete('/delete/:id', auth, userController.deleteUser);

router.get('/analysis', userController.groupUsersBySameDate);
module.exports = router;
