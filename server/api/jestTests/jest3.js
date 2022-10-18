const fs = require('fs');
const router = require('express').Router();
const acorn = require('acorn');
const walk = require('acorn-walk');
const util = require('util');

const jsCode = `
function isNumber(value){
  return typeof value === 'number'
};`;

// evaluate test

router.post('/', async (req, res) => {
  try {
    let ast = acorn.parse(req.body.code, {
      ecmaVersion: 2020,
    });

    let toBe1TestPassed = false;
    // console.log(toBe1TestPassed);
    walk.full(ast, (node) => {
      if (
        node.type === 'CallExpression' &&
        node.callee?.property?.name === 'toBe'
      ) {
        node.arguments.map((argument) => {
          if (argument.value === true && argument.start < 165) {
            toBe1TestPassed = true;
          }
        });
      }
    });

    let toBe2TestPassed = false;
    walk.full(ast, (node) => {
      if (
        node.type === 'CallExpression' &&
        node.callee?.property?.name === 'toBe'
      ) {
        node.arguments.map((argument) => {
          if (argument.value === false && argument.start > 280) {
            toBe2TestPassed = true;
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
            argument.callee?.name === 'isNumber'
          ) {
            argument.arguments.map((argument) => {
              if (Number.isInteger(argument.value)) {
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
            argument.callee?.name === 'isNumber'
          ) {
            argument.arguments.map((argument) => {
              if (!Number.isInteger(argument.value)) {
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
      toBe1TestPassed &&
      toBe2TestPassed &&
      expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json(`
      toBe matchers are correct.
      expect functions are correct.
      That looks right! Go ahead and submit your test!`);
    } else if (
      !toBe1TestPassed &&
      !toBe2TestPassed &&
      expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json('You failed. Check your toBe assertions!');
    } else if (
      !toBe1TestPassed &&
      !toBe2TestPassed &&
      !expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json(
        'You failed. Check your toBe assertions and your first expect function!',
      );
    } else if (
      toBe1TestPassed &&
      !toBe2TestPassed &&
      expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json('You failed. Check your second toBe assertion');
    } else if (
      toBe1TestPassed &&
      !toBe2TestPassed &&
      !expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json(
        'You failed. Check your first toBe assertion and first expect function',
      );
    } else if (
      toBe1TestPassed &&
      !toBe2TestPassed &&
      !expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json(
        'You failed. Check your first toBe assertion and both expect functions',
      );
    } else if (
      toBe1TestPassed &&
      toBe2TestPassed &&
      !expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json('You failed. Check your first expect functions');
    } else if (
      toBe1TestPassed &&
      toBe2TestPassed &&
      !expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json('You failed. Check both expect functions');
    } else if (
      toBe1TestPassed &&
      toBe2TestPassed &&
      expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json('You failed. Check the second expect functions');
    } else if (
      !toBe1TestPassed &&
      toBe2TestPassed &&
      !expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json(
        'You failed. Check your first toBe assertion and your first expect function',
      );
    } else if (
      !toBe1TestPassed &&
      toBe2TestPassed &&
      expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json(
        'You failed. Check your first toBe assertion and your last expect function',
      );
    } else if (
      toBe1TestPassed &&
      !toBe2TestPassed &&
      expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json(
        'You failed. Check your second toBe assertion and your last expect function',
      );
    } else if (
      !toBe1TestPassed &&
      toBe2TestPassed &&
      !expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json(
        'You failed. Check your first toBe assertion and both expect function',
      );
    } else if (
      !toBe1TestPassed &&
      toBe2TestPassed &&
      expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json('You failed. Check your first toBe assertion!');
    } else {
      res.json('You failed. Check both expect functions and toBe assertions');
    }
  } catch (err) {
    res.json('Syntax Error!');
  }
});

// submit test

router.post('/results', async (req, res) => {
  if (req.body.passedTest === 'true') {
    req.body.id = req.body.id + '.test.js';
    fs.writeFile(
      './testFiles/' + req.body.id,
      jsCode + '\n' + req.body.code,
      function (err) {
        if (err) throw err;
      },
    );

    try {
      const exec = util.promisify(require('child_process').exec);
      const { stderr } = await exec(`npm test ${req.body.id}`);
      res.json(stderr.toString());
    } catch (err) {
      res.send(err.toString());
    } finally {
      fs.unlinkSync('./testFiles/' + req.body.id, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('success!');
        }
      });
    }
  }
});

module.exports = router;
