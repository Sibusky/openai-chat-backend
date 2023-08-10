require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { DB_URL, PORT } = process.env;

const app = express();

// Convert request body to JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes import
app.use(require('./routes/index'));

async function startApp() {
  mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      app.listen(PORT, () => {
        console.log('App started and listening on port', PORT);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

startApp();
