const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser, getCurrentUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

const bodyValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(8),
  }),
});

// Login
router.post('/start', bodyValidation, login);
// Registration
router.put('/start', bodyValidation, createUser);
// Get current user
router.get('/start/me', auth, getCurrentUser);

module.exports = router;
