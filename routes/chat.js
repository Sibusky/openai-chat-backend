const router = require('express').Router();
const auth = require('../middlewares/auth');

const { getMessage } = require('../controllers/messages');

router.post('/chat', auth, getMessage);

module.exports = router;
