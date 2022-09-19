const fs = require('fs');
const router = require('express').Router();
const acorn = require('acorn');
const walk = require('acorn-walk');
// const { models: { User }} = require('../db')
// route that will create a new file from the submitted code and run the file
// router.post('/', async (req, res, next) => {
//   try {
//     // create a new file with the submitted code
//     fs.writeFile('test.js', req.body.code, (err) => {
//       if (err) throw err;
//       console.log('The file has been saved!');
//     });

//     // run the file
//     const test = require('./test.js');

//     // check if the file has a console.log
//     const hasConsoleLog = (node) => {
//       if (node.type === 'CallExpression' && node.callee.type === 'MemberExpression' && node.callee.object.type === 'Identifier' && node.callee.object.name === 'console' && node.callee.property.type === 'Identifier' && node.callee.property.name === 'log') {

// // oh, just have a test file, run the user submitted file
// // then grab the

router.post('/', async (req, res, next) => {
  try {
    // create a new file with the submitted code
    fs.writeFile('sum.test.js', req.body.code, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  } catch (err) {
    next(err);
  }
});

router.get('/results', async (req, res, next) => {
  try {
    const { runCLI } = require('jest');
    runCLI({}, [process.cwd()])
      .catch((error) => {
        console.log('Error:');
        console.log(error);
      })
      .then(() => {
        console.log('Done');
      });
    // const { run } = require('jest');
    // run(['sum.test.js'], { rootDir: __dirname }).then((results) => {
    //   console.log(results);
    //   res.send(results);
    // });

    // const { results } = await runCLI(
    //   {
    //     testPathPattern: 'sum.test.js',
    //     watch: false,
    //     silent: true,
    //   },
    //   [process.cwd()],
    // );
    // const { numFailedTests, numPassedTests, numPendingTests, testResults } =
    //   results;
    // const { failureMessage } = testResults[0];
    // const { message } = failureMessage;
    // res.send({ numFailedTests, numPassedTests, numPendingTests, message });
  } catch (err) {
    next(err);
  }
});

router.post('/deprecated', (req, res, next) => {
  try {
    // Both parts, Part 1 and Part 2, can run on their own,
    // but when run together,
    // it doesn't work
    // Works on the node command line?!

    // const util = require('util');
    // Part 1: Create a new file with the submitted code
    const { code } = req.body;
    // const writeFile = util.promisify(fs.writeFileSync);
    // await writeFile('sum.test.js', code);

    // console.log('The file has been saved!');

    // try writeStream? next time?

    // const file = fs.readFileSync('sum.test.js', 'utf8');
    // console.log('file is read after write', file);

    // Part 2: Run the file
    // const exec = util.promisify(require('child_process').exec);

    // fs.writeFile('sum.test.js', req.body.code, async (err) => {
    //   if (err) throw err;
    //   console.log('The file has been saved!');
    //   const execution = await exec('npm run test');
    //   console.log('execution', execution);
    // });

    // this is blocking the process
    // const execution = await exec('npm test');
    // console.log('this is the execution');
    // const execution = await exec('echo "hello"'); // this works
    // const execution = await exec('npm run testCanRunNode'); //

    // console.log('execution', execution);
    // console.log('stdout:', execution.stdout);
    // console.log('stderr:', execution.stderr);
    // console.log('can we get here?');

    // 1. write to a file
    // 2. run the npm test command
    // const { execSync } = require('child_process');
    // const stuff = execSync('npm run testCanRunNode');
    // const stuff = execSync('echo "hello"');
    // const stuff = 'hello';
    // console.log('stuff', stuff);

    // Attempt #?: using jest cli
    // uncomment this after showing we can run the file with runCli or run
    fs.writeFileSync('sum.test.js', code);
    // eslint-disable-next-line no-unused-vars
    const { runCLI, run } = require('jest');

    // THIS Runs and spits out results in command line
    // but not after a writeFileSync
    runCLI(
      {
        runInBand: true,
      },
      [process.cwd()],
    ).then((result) => {
      console.log('result', result);
    });

    // FOR MONDAY BECAUSE WRITING A FILE AND THAN RUNNING IT ISN'T WORKING
    // OR MAybe TO DO:
    // 1. write to a file in one request
    // 2. send the file name back to frontend
    // 3. frontend sends a request to run the file
    // 4. backend runs the file and sends back the results

    // await fs.writeFileSync('sum.test.js', code);

    // runCLI({ config: 'jest.config.js' }, [process.cwd()]).then((result) => {
    //   console.log('result', result);
    // });
    // ERROR: test is not defined
    // runCLI({ projects: ['sum.test.js'], runInBand: true }, [
    //   process.cwd(),
    // ]).then((result) => {
    //   console.log('result', result);
    // });

    // run(['sum.test.js'], { runInBand: true }).then((result) => {
    //   console.log('result', result);
    // });

    res.send('hello');
    // res.send(execution.stderr);
  } catch (err) {
    console.log('GOT HERE IN THE CATCH', err);
    // res.send(err.stdout);
    next(err);
  }
});

router.post('/acorn', (req, res) => {
  // parse user input from editor into AST
  try {
    let ast = acorn.parse(req.body.code, {
      ecmaVersion: 2020,
    });

    // walk through 'toBe('Hellow, World!)' AST to evaluate statement accuracy

    let toBeTestPassed = false;
    walk.full(ast, (node) => {
      console.log(node); // <--- console.log of the AST of the toBe('Hello, World!') expression
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

    if (toBeTestPassed && expectTestPassed) {
      res.json('You passed the test');
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
