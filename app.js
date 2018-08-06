const express = require('express');
const mongoose = require('mongoose');
const apiRouter = require('./routes/api');
const {DB_URL} = process.env || require('./config')
const app = express();
const bodyParser = require('body-parser');
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.json())

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => console.log(`Connected to ${DB_URL}`))

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Page not found' });
})

app.use((err, req, res, next) => {
  const {msg} = err
  if(err.status) res.status(err.status).send({msg})
  else res.status(500).send({error: err})
})

module.exports = app;