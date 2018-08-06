const seedDB = require('./seed');
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL || require('../config').DB_URL
const data = require('./devData')


mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    return seedDB(data)
  })
  .then(() => {
    mongoose.disconnect();
  })
  .catch(console.log)
