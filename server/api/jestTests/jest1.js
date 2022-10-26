const router = require('express').Router();
const acorn = require('acorn');
const walk = require('acorn-walk');

// evaluate test

router.post('/', async (req, res) => {
  try {
    // walk through 'toBe('Hello, World!)' AST to evaluate statement accuracy
    let ast = acorn.parse(req.body.code, {
      ecmaVersion: 2020,
    });

    let toBeTestPassed = false;
    walk.full(ast, (node) => {
      //   console.log(node); // <--- console.log of the AST of the toBe('Hello, World!') expression
      if (
        node.type === 'CallExpression' &&
        node.callee?.property?.name === 'toBe'
      ) {
        node.arguments.map((argument) => {
          if (argument.value === 'Hello, World!') {
            toBeTestPassed = true;
          }
        });
      }
    });
    // walk through 'expect(helloWorld('World')' AST to evaluate statement accuracy

    let expectTestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'expect') {
        node.arguments.map((argument) => {
          if (argument.callee.name === 'helloWorld') {
            argument.arguments.map((argument) => {
              if (argument.value === 'World!') {
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
    if (toBeTestPassed && expectTestPassed) {
      res.json(`
      toBe matcher is correct.
      expect function is correct.
      That looks right! Go ahead and submit your test!`);
    } else if (!toBeTestPassed && expectTestPassed) {
      res.json('You failed. Check your toBe assertion!');
    } else if (toBeTestPassed && !expectTestPassed) {
      res.json('You failed. Check your expect assertion!');
    } else {
      res.json('You failed. Check both toBe and expect assertions.');
    }
  } catch (err) {
    res.json('Syntax Error!');
  }
});

module.exports = router;
