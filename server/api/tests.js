const fs = require('fs');
const jest = require('jest');
const router = require('express').Router();
const acorn = require('acorn');
const walk = require('acorn-walk');
const util = require('util');

const testFileName = 'helloWorld.test.js';

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
        node.callee &&
        node.callee.property &&
        node.callee.property.name === 'toBe'
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
      if (
        node.type === 'CallExpression' &&
        node.callee &&
        node.callee.name === 'expect'
      ) {
        node.arguments.map((argument) => {
          if (argument.callee.name === 'helloWorld') {
            argument.arguments.map((argument) => {
              if (argument.value === 'World') {
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
      expect funcntion is correct.
      That looks right! Go ahead and submit your test!`);
    } else if (!toBeTestPassed && expectTestPassed) {
      res.json('You failed. Check your toBe assertion!');
    } else if (toBeTestPassed && !expectTestPassed) {
      res.json('You failed. Check your expect assertion!');
    } else {
      res.json('You failed. Check both toBe and expect assertions.');
    }

    // if test passes AST evaluation, append the user-created unit test (req.body.code) to file that contains .js code to test against
    if (toBeTestPassed && expectTestPassed) {
      fs.appendFile(testFileName, '\n' + req.body.code, function (err) {
        if (err) throw err;
      });
    }
  } catch (err) {
    res.json('Syntax Error!');
  }
});

// submit test

router.get('/results', async (req, res) => {
  try {
    // use runCLI to test user-created tests against .js code found in runCLI options (testPathPattern), assign output to results object
    await jest.runCLI(
      {
        testPathPattern: 'helloWorld.test.js',
        watch: false,
        silent: true,
        json: true,
        useStderr: false,
      },
      [process.cwd()],
    );

    const exec = util.promisify(require('child_process').exec);
    const { stderr } = await exec('npm run test helloWorld.test.js');

    // remove user-created test from .js file

    const removeLines = (data, lines = []) => {
      return data
        .split('\n')
        .filter((val, idx) => lines.indexOf(idx) === -1)
        .join('\n');
    };

    // create helper function that builds an array starting on the line after the .js code to 1000 eg. [3, 4, 5, 6...]

    const removeLinesHelper = [];
    const removeLinesHelperFunc = () => {
      for (let i = 3; i < 1000; i++) {
        removeLinesHelper.push(i);
      }
    };

    removeLinesHelperFunc();

    fs.readFile('helloWorld.test.js', 'utf8', (err, data) => {
      if (err) throw err;

      fs.writeFile(
        'helloWorld.test.js',
        removeLines(data, removeLinesHelper),
        'utf8',
        function (err) {
          if (err) throw err;
          console.log('the lines have been removed.');
        },
      );
    });

    res.json(stderr.toString());
  } catch (err) {
    res.send(err.toString());
  }
});

module.exports = router;
