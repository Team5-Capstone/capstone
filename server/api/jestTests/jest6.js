const router = require('express').Router();
const acorn = require('acorn');
const walk = require('acorn-walk');

// evaluate test

router.post('/', async (req, res) => {
  try {
    let ast = acorn.parse(req.body.code, {
      ecmaVersion: 2020,
    });
    // console.log(ast);
    let describeTestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'describe') {
        node.arguments.map((argument) => {
          let regex = /^.*?\boutside\b$/im;
          let regex2 = /^.*?\bweather\b$/im;
          let regex3 = /^.*?\bweatheroutside\b$/im;

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
    // console.log(err);
    res.json('Syntax Error!');
  }
});

module.exports = router;
