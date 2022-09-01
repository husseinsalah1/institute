const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const cors = require('cors');
const connect = require('./config/db');

// Require Routes
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const regCourseRoutes = require('./routes/registeredCourseRoutes');

connect();

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};
const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
//Routes use
app.use('/user', userRoutes);
app.use('/course', courseRoutes);
app.use('/inquiry', inquiryRoutes);
app.use('/review', reviewRoutes);
app.use('/registeredcourse', regCourseRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server is running on port :', port);
});
