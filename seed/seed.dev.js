const seedDB = require('./seed');
const mongoose = require('mongoose');
const {DB_URL} = require('../config')
const data = require('./devData')


mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    return seedDB(data)
  })
  .then(() => {
    mongoose.disconnect();
  })
