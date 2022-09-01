const validator = require('validator');
const isEmpty = require('./isEmpty');

const validateRegisterInputs = (userData) => {
  var errors = {};

  userData.name = !isEmpty(userData.name) ? userData.name : '';
  userData.email = !isEmpty(userData.email) ? userData.email : '';
  userData.password = !isEmpty(userData.password) ? userData.password : '';
  userData.phone = !isEmpty(userData.phone) ? userData.phone : '';
  if (!validator.isLength(userData.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }
  if (!validator.isLength(userData.password, { min: 8, max: 30 })) {
    errors.password = 'Password must be between 8 and 30 characters';
  }
  if (userData.password.toLowerCase().includes('password')) {
    errors.password = 'Password cannot contain "password"';
  }
  if (!validator.equals(userData.password, userData.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match';
  }

  if (isEmpty(userData.name)) {
    errors.name = 'Name is required';
  }
  if (isEmpty(userData.email)) {
    errors.email = 'ُEmail is required';
  }
  if (isEmpty(userData.password)) {
    errors.password = 'Password is required';
  }
  if (isEmpty(userData.confirmPassword)) {
    errors.confirmPassword = 'Confirm Password is required';
  }

  if (isEmpty(userData.phone)) {
    errors.phone = 'Phone is required';
  }
  return { errors, isValid: isEmpty(errors) };
};
const validateLoginInputs = (userData) => {
  var errors = {};
  userData.email = !isEmpty(userData.email) ? userData.email : '';
  userData.password = !isEmpty(userData.password) ? userData.password : '';
  if (!validator.isLength(userData.password, { min: 8, max: 30 })) {
    errors.password = 'Password must be between 8 and 30 characters';
  }
  if (isEmpty(userData.email)) {
    errors.email = 'ُEmail is required';
  }
  if (isEmpty(userData.password)) {
    errors.password = 'Password is required';
  }
  return { errors, isValid: isEmpty(errors) };
};
const validateUpdateInputs = (userData) => {
  var errors = {};
  userData.email = !isEmpty(userData.email) ? userData.email : '';
  userData.phone = !isEmpty(userData.phone) ? userData.phone : '';
  userData.name = !isEmpty(userData.name) ? userData.name : '';
  userData.password = !isEmpty(userData.password) ? userData.password : '';
  userData.confirmPassword = !isEmpty(userData.confirmPassword)
    ? userData.confirmPassword
    : '';
  if (
    userData.password !== '' &&
    !validator.isLength(userData.password, { min: 8, max: 30 })
  ) {
    errors.password = 'Password must be between 8 and 30 characters';
  }
  if (userData.password.toLowerCase().includes('password')) {
    errors.password = 'Password cannot contain "password"';
  }
  if (!validator.equals(userData.password, userData.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match';
  }

  if (isEmpty(userData.email)) {
    errors.email = 'Email is required';
  }
  if (isEmpty(userData.name)) {
    errors.name = 'Name is required';
  }
  if (isEmpty(userData.phone)) {
    errors.phone = 'Phone is required';
  }
  return { errors, isValid: isEmpty(errors) };
};

module.exports = {
  validateRegisterInputs,
  validateLoginInputs,
  validateUpdateInputs,
};
