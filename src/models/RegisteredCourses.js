const mongoose = require('mongoose');
const { Schema } = mongoose;
const registeredCoursesSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
  date: {
    type: Date,
    default: Date.now,
  },
  courseCode: {
    type: String,
    reqiured: true,
  },
});
const RegisteredCourses = mongoose.model(
  'RegisteredCourses',
  registeredCoursesSchema
);

module.exports = RegisteredCourses;
