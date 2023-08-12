const router = require('express').Router();
const auth = require('../middlewares/auth');

const { postMessage, getAllMessages, deleteMessage } = require('../controllers/messages');

router.get('/chat', auth, getAllMessages);
router.post('/chat', auth, postMessage);
router.delete('/chat/:_id', auth, deleteMessage);

module.exports = router;
