const router = require('express').Router();
const acorn = require('acorn');
const walk = require('acorn-walk');

// evaluate test

router.post('/', async (req, res) => {
  try {
    let ast = acorn.parse(req.body.code, {
      ecmaVersion: 2020,
    });

    let toEqual1TestPassed = false;
    walk.full(ast, (node) => {
      if (
        node.type === 'CallExpression' &&
        node.callee?.property?.name === 'toEqual'
      ) {
        node.arguments.map((argument) => {
          if (argument.name === 'array') {
            toEqual1TestPassed = true;
          }
        });
      }
    });

    let notToBe2TestPassed = false;
    walk.full(ast, (node) => {
      if (
        node.type === 'CallExpression' &&
        node.callee?.property?.name === 'toBe'
      ) {
        node.arguments.map((argument) => {
          if (argument.name === 'array') {
            notToBe2TestPassed = true;
          }
        });
      }
    });

    let expect1TestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'expect') {
        node.arguments.map((argument) => {
          if (
            argument.type === 'CallExpression' &&
            argument.callee?.name === 'cloneArray'
          ) {
            argument.arguments.map((argument) => {
              if (argument.name === 'array' && argument.start < 105) {
                expect1TestPassed = true;
              }
            });
          }
        });
      }
    });

    let expect2TestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'expect') {
        node.arguments.map((argument) => {
          if (
            argument.type === 'CallExpression' &&
            argument.callee?.name === 'cloneArray'
          ) {
            argument.arguments.map((argument) => {
              if (argument.name === 'array' && argument.start > 135) {
                expect2TestPassed = true;
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
    if (
      toEqual1TestPassed &&
      notToBe2TestPassed &&
      expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json(`
      toEqual matcher is correct.
      not.toBe matcher is correct.
      expect functions are correct.
      That looks right! Go ahead and submit your test!`);
    } else if (
      !toEqual1TestPassed &&
      !notToBe2TestPassed &&
      expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json('You failed. Check your toEqual and your not.toBe assertions!');
    } else if (
      !toEqual1TestPassed &&
      !notToBe2TestPassed &&
      !expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json(
        'You failed. Check your toEqual, not.toBe assertions and your first expect function!',
      );
    } else if (
      toEqual1TestPassed &&
      !notToBe2TestPassed &&
      expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json('You failed. Check your not.toBe assertion');
    } else if (
      toEqual1TestPassed &&
      !notToBe2TestPassed &&
      !expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json(
        'You failed. Check your toEqual assertion and first expect function',
      );
    } else if (
      toEqual1TestPassed &&
      !notToBe2TestPassed &&
      !expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json(
        'You failed. Check your toEqual assertion and both expect functions',
      );
    } else if (
      toEqual1TestPassed &&
      notToBe2TestPassed &&
      !expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json('You failed. Check your first expect functions');
    } else if (
      toEqual1TestPassed &&
      notToBe2TestPassed &&
      !expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json('You failed. Check both expect functions');
    } else if (
      toEqual1TestPassed &&
      notToBe2TestPassed &&
      expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json('You failed. Check the second expect functions');
    } else if (
      !toEqual1TestPassed &&
      notToBe2TestPassed &&
      !expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json(
        'You failed. Check your toEqual assertion and your first expect function',
      );
    } else if (
      !toEqual1TestPassed &&
      notToBe2TestPassed &&
      expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json(
        'You failed. Check your toEqual assertion and your last expect function',
      );
    } else if (
      toEqual1TestPassed &&
      !notToBe2TestPassed &&
      expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json(
        'You failed. Check your not.toBe assertion and your last expect function',
      );
    } else if (
      !toEqual1TestPassed &&
      notToBe2TestPassed &&
      !expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json(
        'You failed. Check your toEqual assertion and both expect function',
      );
    } else if (
      !toEqual1TestPassed &&
      notToBe2TestPassed &&
      expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json('You failed. Check your toEqual assertion!');
    } else {
      res.json(
        'You failed. Check both expect functions and your toEqual and not.toBe assertions',
      );
    }
  } catch (err) {
    res.json('Syntax Error!');
  }
});

module.exports = router;
