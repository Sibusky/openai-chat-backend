const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
// const { login } = require('../controllers/users');
// const { createUser } = require('../controllers/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;

// Login validation using celebrate
const loginValidation = celebrate({
  body: Joi.object().keys({
    loginName: Joi.string().required().min(2).max(30),
    loginPassword: Joi.string().required().min(8),
  }),
});

// Registration validation using celebrate
const bodyValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(8),
  }),
});

// Login route
router.post('/start', loginValidation, (req, res, next) => {
  const { loginName, loginPassword } = req.body;

  return User.findUserByCredentials(loginName, loginPassword)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch((error) => {
      next(res.status(401).json(error));
    });
});

// Registration route
router.post('/start', bodyValidation, (req, res, next) => {
  const { name, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        password: hash,
        name,
      })
    )
    .then((user) =>
      res.status(201).send({
        name: user.name,
        _id: user._id,
      })
    )
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(res.status(400).json(error));
      } else if (error.code === 11000) {
        next(res.status(1100).json(error));
      } else {
        next(error);
      }
    });
});

module.exports = router;
