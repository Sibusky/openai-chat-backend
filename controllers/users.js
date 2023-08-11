const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;

// Login
module.exports.login = (req, res, next) => {
  const { name, password } = req.body;
  return User.findUserByCredentials(name, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(() => {
      const unauthorizedError = new Error('Authentication failed, incorrect name or password');
      unauthorizedError.status = 401;
      res.send(unauthorizedError.message);
      next(unauthorizedError);
    });
};

// Registration
module.exports.createUser = (req, res, next) => {
  const { name, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      password: hash,
      name,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      _id: user._id,
    }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        const badRequestError = new Error('Validation Error. Check input data for name and password');
        badRequestError.status = 400;
        res.send(badRequestError.message);
        next(badRequestError);
      } else if (error.code === 11000) {
        const conflictError = new Error('Conflict Error. User with this name already exists');
        conflictError.status = 1100;
        res.send(conflictError.message);
        next(conflictError);
      } else {
        next(error);
      }
    });
};
