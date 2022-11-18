const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const cors = require('cors');
const connect = require('./config/db');
const path = require('path');

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
app.use(express.static('build'));
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
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server is running on port :', port);
});
