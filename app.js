require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const DB_URL = 'mongodb+srv://sibusky:ag3qF74AELq5ILMt@cluster0.gwi0hqg.mongodb.net/?retryWrites=true&w=majority';
const PORT = 3001;

const app = express();

// Convert request body to JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Allow CORS
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://gpt-chat.netlify.app', 'https://gpt-chat.netlify.app/'],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  }),
);

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
