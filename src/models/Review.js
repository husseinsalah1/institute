const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    review: {
      type: String,
      required: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
    trainee: {
      type: String,
      default: 'Trainee in language courses',
    },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
