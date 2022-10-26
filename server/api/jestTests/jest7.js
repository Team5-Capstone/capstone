const router = require('express').Router();
const acorn = require('acorn');
const walk = require('acorn-walk');

router.post('/', async (req, res) => {
  try {
    let ast = acorn.parse(req.body.code, {
      ecmaVersion: 2020,
    });
    // console.log(ast);
    let testTestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'test') {
        node.arguments.map((argument) => {
          let regex = /^.*?\bapples\b$/im;
          let regex2 = /^.*?\bshoppinglist\b$/im;
          let regex3 = /^.*?\bshopping\b$/im;
          let regex4 = /^.*?\blist\b$/im;

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

    // send different messages to user depending on accuracy of their test
    if (req.body.code.length < 1) {
      res.json("You haven't entered anything!");
    }
    if (testTestPassed) {
      res.json(`
        test function is correct.
        That looks right! Go ahead and submit your test!`);
    } else {
      res.json('You failed. Check your test function.');
    }
  } catch (err) {
    // console.log(err);
    res.json('Syntax Error!');
  }
});

module.exports = router;
