const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const reviewController = require('../controllers/reviewContoller');

router.post('/add', auth, reviewController.create);
router.get('/show', reviewController.show);
router.patch('/update/:id', auth, reviewController.accept);
router.delete('/delete/:id', auth, reviewController.delete);

module.exports = router;
