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
router.post('/', bodyValidation, login);
// Registration
router.put('/', bodyValidation, createUser);
// Get current user
router.get('/me', auth, getCurrentUser);

// Chat
router.use(require('./chat'));

// Page not found
router.use('/*', (req, res, next) => next(res.status(404).json('Page not found')));

module.exports = router;
