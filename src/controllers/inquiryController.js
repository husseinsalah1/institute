const Inquiry = require('../models/Inquiry');
const { inquiryValidation } = require('../validation/inquiryValidation');
module.exports = {
  create: async (req, res) => {
    const inquiryData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      inquiries: req.body.inquiries,
    };
    const { errors, isValid } = inquiryValidation(inquiryData);
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    try {
      const inquiry = new Inquiry(inquiryData);
      await inquiry.save();
      res.json({ inquiry });
    } catch (error) {
      console.log(error);
    }
  },
  show: async (req, res) => {
    try {
      const inquiries = await Inquiry.find().sort();
      res.json({ inquiries });
    } catch (error) {}
  },
};
