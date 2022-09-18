// const fs = require('fs');

const router = require('express').Router();
const acorn = require('acorn');
const walk = require('acorn-walk');
// const { models: { User }} = require('../db')
module.exports = router;

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
    let ast = acorn.parse(req.body.code, { ecmaVersion: 2020 });

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
