const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const inquiryController = require('../controllers/inquiryController');

router.post('/add', inquiryController.create);
router.get('/show', auth, inquiryController.show);

module.exports = router;
