const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    about: {
      type: [String],
    },
    image: {
      type: Buffer,
    },
    category: {
      type: String,
      required: true,
    },
    hours: {
      type: Number,
    },
    duration: {
      type: String,
    },
    classes: {
      type: String,
    },
    attends: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
    },
    isHasOffer: {
      type: Boolean,
      default: false,
    },
    offer: {
      type: String,
      default: 0,
    },
    startOfferDate: {
      type: Date,
      default: new Date(),
    },
    endOfferDate: {
      type: Date,
      default: new Date(),
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    lang: {
      type: String,
    },
    courseCode: {
      type: String,
      requried: true,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
