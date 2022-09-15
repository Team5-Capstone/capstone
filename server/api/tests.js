const router = require('express').Router();
// const { models: { User }} = require('../db')
module.exports = router;

router.post('/', async (req, res, next) => {
  try {
    console.log(req.body);
    res.json({ message: 'success' });
  } catch (err) {
    next(err);
  }
});
