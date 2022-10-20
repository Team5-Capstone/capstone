const router = require('express').Router();
const allTests = require('./ast');

// evaluate test

router.post('/', async (req, res) => {
  try {
    console.log(req.body.orderNum);
    allTests(req.body.orderNum, req, res);
  } catch (err) {
    console.log(err);
    res.json('Syntax Error!');
  }
});

module.exports = router;
