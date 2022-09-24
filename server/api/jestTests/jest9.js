const fs = require('fs');
const router = require('express').Router();
const acorn = require('acorn');
const walk = require('acorn-walk');
const util = require('util');

const jsCode = `    
const charCount = (str, letter) => {
  let letterCount = 0;
  for (let position = 0; position < str.length; position++) 
  {
    if (str.charAt(position) == letter) 
      {
      letterCount += 1;
      }
  }
  return letterCount;    
};
`;

// evaluate test

router.post('/', async (req, res) => {
  try {
    let ast = acorn.parse(req.body.code, {
      ecmaVersion: 2020,
    });

    let describeTestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'describe') {
        node.arguments.map((argument) => {
          let regex = /^.*?\bcharcount\b$/im;
          let regex2 = /^.*?\bchar\b$/im;
          let regex3 = /^.*?\bcount\b$/im;
          if (
            argument.value?.trim().match(regex) ||
            argument.value?.trim().match(regex2) ||
            argument.value?.trim().match(regex3)
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
          console.log(argument.value);
          let regex = /^.*?\bcurrent\b$/im;
          let regex2 = /^.*?\bcount\b$/im;
          let regex3 = /^.*?\bletter\b$/im;
          let regex4 = /^.*?\bpassed\b$/im;
          let regex5 = /^.*?\bcorrect\b$/im;
          let regex6 = /^.*?\breturn\b$/im;

          if (
            argument.value?.trim().match(regex) ||
            argument.value?.trim().match(regex2) ||
            argument.value?.trim().match(regex3) ||
            argument.value?.trim().match(regex4) ||
            argument.value?.trim().match(regex5) ||
            argument.value?.trim().match(regex6)
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
            argument.callee?.name === 'charCount'
          ) {
            argument.arguments.map((argument) => {
              if (
                (typeof argument.value === 'string' &&
                  argument?.value === 'Hello, World') ||
                (typeof argument.value === 'string' && argument?.value === 'l')
              ) {
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

    let toBeTestPassed = false;
    walk.full(ast, (node) => {
      if (
        node.type === 'CallExpression' &&
        node.callee?.property?.name === 'toBe'
      ) {
        node.arguments.map((argument) => {
          if (Number.isInteger(argument.value)) {
            toBeTestPassed = true;
          }
        });
      }
    });

    console.log(
      describeTestPassed,
      testTestPassed,
      expect1TestPassed,
      toBeTestPassed,
    );

    // send different messages to user depending on accuracy of their test
    if (req.body.code.length < 1) {
      res.json("You haven't entered anything!");
    }
    if (
      describeTestPassed &&
      testTestPassed &&
      expect1TestPassed &&
      toBeTestPassed
    ) {
      res.json(`
      toEqual matcher is correct.
      not.toBe matcher is correct.
      expect functions are correct.
      That looks right! Go ahead and submit your test!`);
    } else if (
      !describeTestPassed &&
      !testTestPassed &&
      expect1TestPassed &&
      toBeTestPassed
    ) {
      res.json('You failed. Check your describe and your test functions!');
    } else if (
      !describeTestPassed &&
      !testTestPassed &&
      !expect1TestPassed &&
      toBeTestPassed
    ) {
      res.json(
        'You failed. Check your describe and test functions and your expect function!',
      );
    } else if (
      describeTestPassed &&
      !testTestPassed &&
      expect1TestPassed &&
      toBeTestPassed
    ) {
      res.json('You failed. Check your test function');
    } else if (
      describeTestPassed &&
      !testTestPassed &&
      !expect1TestPassed &&
      toBeTestPassed
    ) {
      res.json('You failed. Check your test and expect functions');
    } else if (
      describeTestPassed &&
      !testTestPassed &&
      !expect1TestPassed &&
      !toBeTestPassed
    ) {
      res.json('You failed. Check your test, expect and toBe functions');
    } else if (
      describeTestPassed &&
      testTestPassed &&
      !expect1TestPassed &&
      toBeTestPassed
    ) {
      res.json('You failed. Check your expect functions');
    } else if (
      describeTestPassed &&
      testTestPassed &&
      !expect1TestPassed &&
      !toBeTestPassed
    ) {
      res.json('You failed. Check your expect and toBe functions');
    } else if (
      describeTestPassed &&
      testTestPassed &&
      expect1TestPassed &&
      !toBeTestPassed
    ) {
      res.json('You failed. Check your toBe function');
    } else if (
      !describeTestPassed &&
      testTestPassed &&
      !expect1TestPassed &&
      toBeTestPassed
    ) {
      res.json(
        'You failed. Check your describe function and your expect function',
      );
    } else if (
      !describeTestPassed &&
      testTestPassed &&
      expect1TestPassed &&
      !toBeTestPassed
    ) {
      res.json(
        'You failed. Check your describe function and your toBe function',
      );
    } else if (
      describeTestPassed &&
      !testTestPassed &&
      expect1TestPassed &&
      !toBeTestPassed
    ) {
      res.json('You failed. Check your test function and toBe functions');
    } else if (
      !describeTestPassed &&
      testTestPassed &&
      !expect1TestPassed &&
      !toBeTestPassed
    ) {
      res.json('You failed. Check your describe, expect and toBe functions');
    } else if (
      !describeTestPassed &&
      testTestPassed &&
      expect1TestPassed &&
      toBeTestPassed
    ) {
      res.json('You failed. Check your describe function!');
    } else {
      res.json(
        'You failed. Check your describe, test, expect and toBe functions',
      );
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
