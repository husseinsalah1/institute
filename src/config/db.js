const mongoose = require('mongoose');
const UrlDbConnection = process.env.URL_MONGODB;
async function connect() {
  try {
    await mongoose.connect(UrlDbConnection);
    console.log('Connected Successfully to Database');
  } catch (error) {
    console.log('Connected Failed to Database', error);
  }
}
module.exports = connect;
