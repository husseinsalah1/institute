const Review = require('../models/Review');
const mongoose = require('mongoose');
const { reviewValidation } = require('../validation/reviewValidation');
module.exports = {
  create: async (req, res) => {
    const reviewData = {
      userId: req.user._id,
      review: req.body.review,
      trainee: req.body.trainee,
    };
    const { errors, isValid } = reviewValidation(reviewData);
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    try {
      const review = new Review(reviewData);
      await review.save();
      res.json({ review });
    } catch (error) {
      console.log(error);
    }
  },
  show: async (req, res) => {
    try {
      const reviews = await Review.find().sort().populate('userId');
      res.json({ reviews });
    } catch (error) {}
  },
  accept: async (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    try {
      const review = await Review.findById(id);
      review['show'] = true;
      await review.save();
      res.json({ success: true, review });
    } catch (error) {
      console.log(error);
    }
  },
  delete: async (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    try {
      const review = await Review.findByIdAndDelete(id);

      res.json({ success: true });
    } catch (error) {
      console.log(error);
    }
  },
};
