const fs = require('fs');
const router = require('express').Router();
const acorn = require('acorn');
const walk = require('acorn-walk');
const util = require('util');

// evaluate test

router.post('/', async (req, res) => {
  try {
    let ast = acorn.parse(req.body.code, {
      ecmaVersion: 2020,
    });
    console.log(ast);
    let describeTestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'describe') {
        node.arguments.map((argument) => {
          let regex = /^.*?\boutside\b$/m;
          let regex2 = /^.*?\bweather\b$/m;
          if (argument.value?.match(regex) || argument.value?.match(regex2)) {
            describeTestPassed = true;
          }
        });
      }
    });

    // send different messages to user depending on accuracy of their test
    if (req.body.code.length < 1) {
      res.json("You haven't entered anything!");
    }
    if (describeTestPassed) {
      res.json(`
        describe function is correct.
        That looks right! Go ahead and submit your test!`);
    } else {
      res.json('You failed. Check your describe function.');
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
      fs.writeFile('./testFiles/' + req.body.id, req.body.code, function (err) {
        if (err) throw err;
      });

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
