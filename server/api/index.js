const router = require('express').Router();
module.exports = router;

router.use('/evaluateTest', require('./evaluateTest.js'));
router.use('/submitTest', require('./submitTest.js'));
router.use('/users', require('./users'));
router.use('/prompts', require('./prompts'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
