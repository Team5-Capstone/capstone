const fs = require('fs');
const jest = require('jest');
const router = require('express').Router();
const acorn = require('acorn');
const walk = require('acorn-walk');
const testFileName = 'helloWorld.test.js';

router.post('/', async (req, res, next) => {
  try {
    // const { code } = req.body;
    // fs.writeFileSync('submitted.js', code);

    // const { spawn } = require('child_process');
    // const child = spawn('node', ['submitted.js'], { shell: true });
    // child.stdout.on('data', (data) => {
    //   console.log(`stdout: ${data}`);
    //   res.send(data);
    // });

    // child.stderr.on('data', (data) => {
    //   console.error(`stderr: ${data}`);
    //   res.send(data);
    // });

    // child.on('close', (code) => {
    //   console.log(`child process exited with code ${code}`);
    //   res.send(code);
    // });

    const objectToHoldStdout = {
      stdout: '',
    };

    // TODO: Run a npm test command with a child process
    const { spawn } = require('child_process');
    const child = spawn('npm', ['test'], { shell: true });
    child.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      objectToHoldStdout.stdout += data;
      res.send(objectToHoldStdout.stdout);
    });

    child.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      objectToHoldStdout.stdout += data;
      res.send(objectToHoldStdout.stdout);
    });

    // console.log('objectToHoldStdout', objectToHoldStdout);
  } catch (err) {
    next(err);
  }
});

router.post('/acorn', (req, res) => {
  // parse user input from editor into AST
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

router.get('/results', async (req, res, next) => {
  try {
    // use runCLI to test user-created tests against .js code found in runCLI options (testPathPattern), assign output to results object

    const { results } = await jest.runCLI(
      {
        testPathPattern: 'helloWorld.test.js',
        watch: false,
        silent: true,
        json: true,
      },
      [process.cwd()],
    );

    // iterate through results object to source data regarding test results (to send back to frontend)

    let testResults = '';
    for (const key in results) {
      if (key === 'testResults') {
        results[key].forEach((result) => {
          for (const key in result) {
            if (key === 'testResults') {
              result[key].forEach((test) => {
                testResults = test.status;
              });
            }
          }
        });
      }
    }

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

    if (testResults === '') {
      testResults = 'Failed. Try Again.';
    } else if (testResults === 'passed') {
      testResults = 'You Passed This Test! Go to the next one!';
    }

    res.json(JSON.stringify(testResults));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
