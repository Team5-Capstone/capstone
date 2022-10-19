const router = require('express').Router();
const acorn = require('acorn');
const walk = require('acorn-walk');

// evaluate test

router.post('/', async (req, res) => {
  try {
    // console.log(req.body.code);
    let ast = acorn.parse(req.body.code, {
      ecmaVersion: 2020,
    });

    let expectTestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'expect') {
        node.arguments.map((argument) => {
          if (
            argument.type === 'CallExpression' &&
            argument.callee?.name === 'notOverTen'
          ) {
            argument.arguments.map((argument) => {
              if (Number.isInteger(argument.value)) {
                expectTestPassed = true;
              }
            });
          }
        });
      }
    });

    let toBeTestPassed = false;
    walk.full(ast, (node) => {
      if (
        node.type === 'CallExpression' &&
        node.callee?.property?.name === 'toBeLessThanOrEqual'
      ) {
        node.arguments.map((argument) => {
          if (Number.isInteger(argument.value)) {
            toBeTestPassed = true;
          }
        });
      }
    });

    // send different messages to user depending on accuracy of their test
    if (req.body.code.length < 1) {
      res.json("You haven't entered anything!");
    }
    if (toBeTestPassed && expectTestPassed) {
      res.json(`
        toBe matcher is correct.
        expect function is correct.
        That looks right! Go ahead and submit your test!`);
    } else if (!toBeTestPassed && expectTestPassed) {
      res.json(
        'You failed. Check your toBe assertion and make sure it is a number!',
      );
    } else if (toBeTestPassed && !expectTestPassed) {
      res.json(
        'You failed. Check your expect assertion and make sure it is a number!',
      );
    } else {
      res.json('You failed. Check both toBe and expect assertions.');
    }
  } catch (err) {
    res.json('Syntax Error!');
  }
});

module.exports = router;
