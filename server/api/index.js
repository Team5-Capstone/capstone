const router = require('express').Router();
module.exports = router;

router.use('/jestTests/jest1', require('./jestTests/jest1.js'));
router.use('/jestTests/jest2', require('./jestTests/jest2.js'));
router.use('/jestTests/jest3', require('./jestTests/jest3.js'));
// router.use('/jest2', require('../jest4'));
// router.use('/jest2', require('../jest5'));
// router.use('/jest2', require('../jest6'));
// router.use('/jest2', require('../jest7'));
// router.use('/jest2', require('../jest8'));
// router.use('/jest2', require('../jest9'));
// router.use('/jest2', require('../jest10'));
router.use('/users', require('./users'));
router.use('/prompts', require('./prompts'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
