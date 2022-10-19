const router = require('express').Router();
const acorn = require('acorn');
const walk = require('acorn-walk');

// evaluate test

router.post('/', async (req, res) => {
  try {
    let ast = acorn.parse(req.body.code, {
      ecmaVersion: 2020,
    });

    let expectTestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'expect') {
        node.arguments.map((argument) => {
          if (
            argument.type === 'CallExpression' &&
            argument.callee?.name === 'isTruthy'
          ) {
            argument.arguments.map((argument) => {
              if (argument.value) {
                expectTestPassed = true;
              }
            });
          }
        });
      }
    });

    // send different messages to user depending on accuracy of their test
    if (req.body.code.length < 1) {
      res.json("You haven't entered anything!");
    }
    if (expectTestPassed) {
      res.json(`
        expect function is correct.
        That looks right! Go ahead and submit your test!`);
    } else {
      res.json('You failed. Check your expect function.');
    }
  } catch (err) {
    res.json('Syntax Error!');
  }
});

module.exports = router;
