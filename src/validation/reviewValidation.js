const validator = require('validator');
const isEmpty = require('./isEmpty');

const reviewValidation = (reviewData) => {
  var errors = {};
  reviewData.review = !isEmpty(reviewData.review) ? reviewData.review : '';

  if (isEmpty(reviewData.review)) {
    errors.review = 'Review is required';
  }

  return { errors, isValid: isEmpty(errors) };
};
module.exports = {
  reviewValidation,
};
