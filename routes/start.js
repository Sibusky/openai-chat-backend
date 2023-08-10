const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');

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

// Login
router.post('/start', loginValidation, login);

// Registration
router.post('/start', bodyValidation, createUser);

module.exports = router;
