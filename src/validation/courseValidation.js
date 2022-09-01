const validator = require('validator');
const isEmpty = require('./isEmpty');
const validateCourseInput = (courseData, file) => {
  var errors = {};
  courseData.name = !isEmpty(courseData.name) ? courseData.name : '';
  courseData.description = !isEmpty(courseData.description)
    ? courseData.description
    : '';
  courseData.category = !isEmpty(courseData.category)
    ? courseData.category
    : '';

  if (!validator.isLength(courseData.name, { max: 90 })) {
    errors.name = 'Name must be at most 30 characters';
  }
  if (isEmpty(courseData.name)) {
    errors.name = 'Name is required';
  }
  if (isEmpty(courseData.description)) {
    errors.description = 'Description is required';
  }
  if (isEmpty(courseData.category)) {
    errors.category = 'Category is required';
  }
  if (isEmpty(file)) {
    errors.image = 'Image is required';
  }
  return { errors, isValid: isEmpty(errors) };
};

module.exports = {
  validateCourseInput,
};
