const mongoose = require('mongoose');
const { Schema } = mongoose;

const inquirySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    inquiries: {
      type: String,
      required: String,
    },
  },
  { timestamps: true }
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);
module.exports = Inquiry;
