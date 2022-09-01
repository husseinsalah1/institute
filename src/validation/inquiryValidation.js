const validator = require('validator');
const isEmpty = require('./isEmpty');

const inquiryValidation = (inquiryData) => {
  var errors = {};
  inquiryData.name = !isEmpty(inquiryData.name) ? inquiryData.name : '';
  inquiryData.email = !isEmpty(inquiryData.email) ? inquiryData.email : '';
  inquiryData.phone = !isEmpty(inquiryData.phone) ? inquiryData.phone : '';
  if (!validator.isLength(inquiryData.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (isEmpty(inquiryData.name)) {
    errors.name = 'Name is required';
  }
  if (isEmpty(inquiryData.email)) {
    errors.email = 'ُEmail is required';
  }

  if (isEmpty(inquiryData.phone)) {
    errors.phone = 'Phone is required';
  }
  if (isEmpty(inquiryData.inquiries)) {
    errors.inquiries = 'Inquiries is required';
  }
  return { errors, isValid: isEmpty(errors) };
};
module.exports = {
  inquiryValidation,
};
