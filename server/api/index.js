const router = require('express').Router();
module.exports = router;

router.use('/jestTests/jest1', require('./jestTests/jest1.js'));
router.use('/jestTests/jest2', require('./jestTests/jest2.js'));
router.use('/jestTests/jest3', require('./jestTests/jest3.js'));
router.use('/jestTests/jest4', require('./jestTests/jest4.js'));
router.use('/jestTests/jest5', require('./jestTests/jest5.js'));
router.use('/jestTests/jest6', require('./jestTests/jest6.js'));
router.use('/jestTests/jest7', require('./jestTests/jest7.js'));
router.use('/jestTests/jest8', require('./jestTests/jest8.js'));
router.use('/jestTests/jest9', require('./jestTests/jest9.js'));

router.use('/users', require('./users'));
router.use('/prompts', require('./prompts'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
