const fs = require('fs');
const router = require('express').Router();
const acorn = require('acorn');
const walk = require('acorn-walk');
const util = require('util');

// evaluate test

let jsCode = `function sum(a, b){
    return a+b
};`;

router.post('/', async (req, res) => {
  try {
    let ast = acorn.parse(req.body.code, {
      ecmaVersion: 2020,
    });

    let describeTestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'describe') {
        node.arguments.map((argument) => {
          let regex = /^.*?\badd\b$/im;
          let regex2 = /^.*?\bsum\b$/im;
          let regex3 = /^.*?\btwo\b$/im;
          let regex4 = /^.*?\bnumbers\b$/im;
          if (
            argument.value?.trim().match(regex) ||
            argument.value?.trim().match(regex2) ||
            argument.value?.trim().match(regex3) ||
            argument.value?.trim().match(regex4)
          ) {
            describeTestPassed = true;
          }
        });
      }
    });

    let testTestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'test') {
        node.arguments.map((argument) => {
          let regex = /^.*?\badd\b$/im;
          let regex2 = /^.*?\bsum\b$/im;
          let regex3 = /^.*?\btwo\b$/im;
          let regex4 = /^.*?\bnumbers\b$/im;
          if (
            argument.value?.trim().match(regex) ||
            argument.value?.trim().match(regex2) ||
            argument.value?.trim().match(regex3) ||
            argument.value?.trim().match(regex4)
          ) {
            testTestPassed = true;
          }
        });
      }
    });

    let count = 0;
    let expect1TestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'expect') {
        node.arguments.map((argument) => {
          if (
            argument.type === 'CallExpression' &&
            argument.callee?.name === 'sum'
          ) {
            argument.arguments.map((argument) => {
              if (Number.isInteger(argument.value)) {
                count++;
              }
              if (count === 2) {
                expect1TestPassed = true;
              }
            });
          }
        });
      }
    });

    console.log(testTestPassed, describeTestPassed, expect1TestPassed);

    // send different messages to user depending on accuracy of their test
    if (req.body.code.length < 1) {
      res.json("You haven't entered anything!");
    }
    if (testTestPassed && describeTestPassed && expect1TestPassed) {
      res.json(`
        describe function is correct.
        test function is correct.
        expect function is correct.
        That looks right! Go ahead and submit your test!`);
    } else if (testTestPassed && !describeTestPassed && !expect1TestPassed) {
      res.json(`Check your describe and expect functions`);
    } else if (testTestPassed && describeTestPassed && !expect1TestPassed) {
      res.json(`Check your expect function`);
    } else if (!testTestPassed && describeTestPassed && !expect1TestPassed) {
      res.json(`Check your test and expect functions`);
    } else if (!testTestPassed && !describeTestPassed && expect1TestPassed) {
      res.json(`Check your test and describe functions`);
    } else if (testTestPassed && !describeTestPassed && expect1TestPassed) {
      res.json(`Check your describe function`);
    } else if (!testTestPassed && describeTestPassed && expect1TestPassed) {
      res.json(`Check your test function`);
    } else {
      res.json('You failed. Check your all functions.');
    }
  } catch (err) {
    console.log(err);
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
