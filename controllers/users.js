const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');

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
      next(new UnauthorizedError('Authentication failed, incorrect name or password'));
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Incorrect data to create user'));
      } else if (err.code === 11000) {
        next(new ConflictError('User already exists'));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('There is no such user');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('There is no user with such id'));
      } else {
        next(err);
      }
    });
};
