const fs = require('fs');
const router = require('express').Router();
const acorn = require('acorn');
const walk = require('acorn-walk');
const util = require('util');

const jsCode = `
function isTruthy(value){
  if (value == true) {
    return true;
  } 
};`;

// evaluate test

router.post('/', async (req, res) => {
  try {
    console.log(req.body.code);
    let ast = acorn.parse(req.body.code, {
      ecmaVersion: 2020,
    });

    let expectTestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'expect') {
        node.arguments.map((argument) => {
          if (argument.value) {
            expectTestPassed = true;
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
    console.log(err);
    res.json('Syntax Error!');
  }
});

// submit test

router.post('/results', async (req, res) => {
  try {
    if (req.body.passedTest === 'true') {
      req.body.id = req.body.id + '.test.js';
      fs.writeFile(
        './testFiles/' + req.body.id,
        jsCode + '\n' + req.body.code,
        function (err) {
          if (err) throw err;
        },
      );

      const exec = util.promisify(require('child_process').exec);
      const { stderr } = await exec(`npm test ${req.body.id}`);

      fs.unlinkSync('./testFiles/' + req.body.id, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('success!');
        }
      }),
        res.json(stderr.toString());
    }
  } catch (err) {
    res.send(err.toString());
  }
});

module.exports = router;
