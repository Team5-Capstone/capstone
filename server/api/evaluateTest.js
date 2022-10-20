const router = require('express').Router();
const allTests = require('./ast');

// evaluate test

router.post('/', async (req, res) => {
  try {
    allTests(req.body.orderNum, req, res);
  } catch (err) {
    res.json('Syntax Error!');
  }
});

module.exports = router;
