const router = require('express').Router();
module.exports = router;

router.use('/jest1', require('./jest1'));
router.use('/users', require('./users'));
router.use('/prompts', require('./prompts'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
