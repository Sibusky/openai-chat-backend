const router = require('express').Router();

router.use(require('./start'));
router.use(require('./chat'));

router.use('/*', (req, res, next) => next(res.status(404).json('Page not found')));

module.exports = router;
