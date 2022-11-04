const acorn = require('acorn');
const walk = require('acorn-walk');

const allTests = (orderNum, req, res) => {
  // test 1

  if (orderNum === 10) {
    let ast = acorn.parse(req.body.code, {
      ecmaVersion: 2020,
    });

    let toBeTestPassed = false;
    walk.full(ast, (node) => {
      if (
        node.type === 'CallExpression' &&
        node.callee?.property?.name === 'toBe'
      ) {
        node.arguments.map((argument) => {
          if (argument.value === 'Hello, World!') {
            toBeTestPassed = true;
          }
        });
      }
    });

    let expectTestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'expect') {
        node.arguments.map((argument) => {
          if (argument.callee.name === 'helloWorld') {
            argument.arguments.map((argument) => {
              if (argument.value === 'World!') {
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
            expect function is correct.
            That looks right! Go ahead and submit your test!`);
    } else if (!toBeTestPassed && expectTestPassed) {
      res.json('You failed. Check your toBe assertion!');
    } else if (toBeTestPassed && !expectTestPassed) {
      res.json('You failed. Check your expect assertion!');
    } else {
      res.json('You failed. Check both toBe and expect assertions.');
    }
  }

  // test 2

  if (orderNum === 20) {
    let ast = acorn.parse(req.body.code, {
      ecmaVersion: 2020,
    });

    let toEqual1TestPassed = false;
    walk.full(ast, (node) => {
      if (
        node.type === 'CallExpression' &&
        node.callee?.property?.name === 'toEqual'
      ) {
        node.arguments.map((argument) => {
          if (argument.name === 'array') {
            toEqual1TestPassed = true;
          }
        });
      }
    });

    let notToBe2TestPassed = false;
    walk.full(ast, (node) => {
      if (
        node.type === 'CallExpression' &&
        node.callee?.property?.name === 'toBe'
      ) {
        node.arguments.map((argument) => {
          if (argument.name === 'array') {
            notToBe2TestPassed = true;
          }
        });
      }
    });

    let expect1TestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'expect') {
        node.arguments.map((argument) => {
          if (
            argument.type === 'CallExpression' &&
            argument.callee?.name === 'cloneArray'
          ) {
            argument.arguments.map((argument) => {
              if (argument.name === 'array' && argument.start < 105) {
                expect1TestPassed = true;
              }
            });
          }
        });
      }
    });

    let expect2TestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'expect') {
        node.arguments.map((argument) => {
          if (
            argument.type === 'CallExpression' &&
            argument.callee?.name === 'cloneArray'
          ) {
            argument.arguments.map((argument) => {
              if (argument.name === 'array' && argument.start > 135) {
                expect2TestPassed = true;
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
    if (
      toEqual1TestPassed &&
      notToBe2TestPassed &&
      expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json(`
            toEqual matcher is correct.
            not.toBe matcher is correct.
            expect functions are correct.
            That looks right! Go ahead and submit your test!`);
    } else if (
      !toEqual1TestPassed &&
      !notToBe2TestPassed &&
      expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json('You failed. Check your toEqual and your not.toBe assertions!');
    } else if (
      !toEqual1TestPassed &&
      !notToBe2TestPassed &&
      !expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json(
        'You failed. Check your toEqual, not.toBe assertions and your first expect function!',
      );
    } else if (
      toEqual1TestPassed &&
      !notToBe2TestPassed &&
      expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json('You failed. Check your not.toBe assertion');
    } else if (
      toEqual1TestPassed &&
      !notToBe2TestPassed &&
      !expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json(
        'You failed. Check your toEqual assertion and first expect function',
      );
    } else if (
      toEqual1TestPassed &&
      !notToBe2TestPassed &&
      !expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json(
        'You failed. Check your toEqual assertion and both expect functions',
      );
    } else if (
      toEqual1TestPassed &&
      notToBe2TestPassed &&
      !expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json('You failed. Check your first expect functions');
    } else if (
      toEqual1TestPassed &&
      notToBe2TestPassed &&
      !expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json('You failed. Check both expect functions');
    } else if (
      toEqual1TestPassed &&
      notToBe2TestPassed &&
      expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json('You failed. Check the second expect functions');
    } else if (
      !toEqual1TestPassed &&
      notToBe2TestPassed &&
      !expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json(
        'You failed. Check your toEqual assertion and your first expect function',
      );
    } else if (
      !toEqual1TestPassed &&
      notToBe2TestPassed &&
      expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json(
        'You failed. Check your toEqual assertion and your last expect function',
      );
    } else if (
      toEqual1TestPassed &&
      !notToBe2TestPassed &&
      expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json(
        'You failed. Check your not.toBe assertion and your last expect function',
      );
    } else if (
      !toEqual1TestPassed &&
      notToBe2TestPassed &&
      !expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json(
        'You failed. Check your toEqual assertion and both expect function',
      );
    } else if (
      !toEqual1TestPassed &&
      notToBe2TestPassed &&
      expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json('You failed. Check your toEqual assertion!');
    } else {
      res.json(
        'You failed. Check both expect functions and your toEqual and not.toBe assertions',
      );
    }
  }

  // test 3

  if (orderNum === 30) {
    let ast = acorn.parse(req.body.code, {
      ecmaVersion: 2020,
    });

    let toBe1TestPassed = false;
    // console.log(toBe1TestPassed);
    walk.full(ast, (node) => {
      if (
        node.type === 'CallExpression' &&
        node.callee?.property?.name === 'toBe'
      ) {
        node.arguments.map((argument) => {
          if (argument.value === true && argument.start < 165) {
            toBe1TestPassed = true;
          }
        });
      }
    });

    let toBe2TestPassed = false;
    walk.full(ast, (node) => {
      if (
        node.type === 'CallExpression' &&
        node.callee?.property?.name === 'toBe'
      ) {
        node.arguments.map((argument) => {
          if (argument.value === false && argument.start > 280) {
            toBe2TestPassed = true;
          }
        });
      }
    });

    let expect1TestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'expect') {
        node.arguments.map((argument) => {
          if (
            argument.type === 'CallExpression' &&
            argument.callee?.name === 'isNumber'
          ) {
            argument.arguments.map((argument) => {
              if (Number.isInteger(argument.value)) {
                expect1TestPassed = true;
              }
            });
          }
        });
      }
    });

    let expect2TestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'expect') {
        node.arguments.map((argument) => {
          if (
            argument.type === 'CallExpression' &&
            argument.callee?.name === 'isNumber'
          ) {
            argument.arguments.map((argument) => {
              if (!Number.isInteger(argument.value)) {
                expect2TestPassed = true;
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
    if (
      toBe1TestPassed &&
      toBe2TestPassed &&
      expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json(`
            toBe matchers are correct.
            expect functions are correct.
            That looks right! Go ahead and submit your test!`);
    } else if (
      !toBe1TestPassed &&
      !toBe2TestPassed &&
      expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json('You failed. Check your toBe assertions!');
    } else if (
      !toBe1TestPassed &&
      !toBe2TestPassed &&
      !expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json(
        'You failed. Check your toBe assertions and your first expect function!',
      );
    } else if (
      toBe1TestPassed &&
      !toBe2TestPassed &&
      expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json('You failed. Check your second toBe assertion');
    } else if (
      toBe1TestPassed &&
      !toBe2TestPassed &&
      !expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json(
        'You failed. Check your first toBe assertion and first expect function',
      );
    } else if (
      toBe1TestPassed &&
      !toBe2TestPassed &&
      !expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json(
        'You failed. Check your first toBe assertion and both expect functions',
      );
    } else if (
      toBe1TestPassed &&
      toBe2TestPassed &&
      !expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json('You failed. Check your first expect functions');
    } else if (
      toBe1TestPassed &&
      toBe2TestPassed &&
      !expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json('You failed. Check both expect functions');
    } else if (
      toBe1TestPassed &&
      toBe2TestPassed &&
      expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json('You failed. Check the second expect functions');
    } else if (
      !toBe1TestPassed &&
      toBe2TestPassed &&
      !expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json(
        'You failed. Check your first toBe assertion and your first expect function',
      );
    } else if (
      !toBe1TestPassed &&
      toBe2TestPassed &&
      expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json(
        'You failed. Check your first toBe assertion and your last expect function',
      );
    } else if (
      toBe1TestPassed &&
      !toBe2TestPassed &&
      expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json(
        'You failed. Check your second toBe assertion and your last expect function',
      );
    } else if (
      !toBe1TestPassed &&
      toBe2TestPassed &&
      !expect1TestPassed &&
      !expect2TestPassed
    ) {
      res.json(
        'You failed. Check your first toBe assertion and both expect function',
      );
    } else if (
      !toBe1TestPassed &&
      toBe2TestPassed &&
      expect1TestPassed &&
      expect2TestPassed
    ) {
      res.json('You failed. Check your first toBe assertion!');
    } else {
      res.json('You failed. Check both expect functions and toBe assertions');
    }
  }

  if (orderNum === 40) {
    let ast = acorn.parse(req.body.code, {
      ecmaVersion: 2020,
    });

    let expectTestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'expect') {
        node.arguments.map((argument) => {
          if (
            argument.type === 'CallExpression' &&
            argument.callee?.name === 'isTruthy'
          ) {
            argument.arguments.map((argument) => {
              if (argument.value) {
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
    if (expectTestPassed) {
      res.json(`
              expect function is correct.
              That looks right! Go ahead and submit your test!`);
    } else {
      res.json('You failed. Check your expect function.');
    }
  }

  if (orderNum === 50) {
    let ast = acorn.parse(req.body.code, {
      ecmaVersion: 2020,
    });

    let expectTestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'expect') {
        node.arguments.map((argument) => {
          if (
            argument.type === 'CallExpression' &&
            argument.callee?.name === 'notOverTen'
          ) {
            argument.arguments.map((argument) => {
              if (Number.isInteger(argument.value)) {
                expectTestPassed = true;
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
        node.callee?.property?.name === 'toBeLessThanOrEqual'
      ) {
        node.arguments.map((argument) => {
          if (Number.isInteger(argument.value)) {
            toBeTestPassed = true;
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
              expect function is correct.
              That looks right! Go ahead and submit your test!`);
    } else if (!toBeTestPassed && expectTestPassed) {
      res.json(
        'You failed. Check your toBe assertion and make sure it is a number!',
      );
    } else if (toBeTestPassed && !expectTestPassed) {
      res.json(
        'You failed. Check your expect assertion and make sure it is a number!',
      );
    } else {
      res.json('You failed. Check both toBe and expect assertions.');
    }
  }

  if (orderNum === 60) {
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
  }

  if (orderNum === 70) {
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
  }

  if (orderNum === 80) {
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

    // console.log(testTestPassed, describeTestPassed, expect1TestPassed);

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
  }

  if (orderNum === 90) {
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
          // console.log(argument.value);
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

    // console.log(
    //   describeTestPassed,
    //   testTestPassed,
    //   expect1TestPassed,
    //   toBeTestPassed,
    // );

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
  }

  if (orderNum === 100) {
    let ast = acorn.parse(req.body.code, {
      ecmaVersion: 2020,
    });

    let describeTestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'describe') {
        node.arguments.map((argument) => {
          let regex = /^.*?\bwoof\b$/im;
          if (argument.value?.trim().match(regex)) {
            describeTestPassed = true;
          }
        });
      }
    });

    let testTestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'test') {
        node.arguments.map((argument) => {
          let regex = /^.*?\bnumber\b$/im;
          let regex2 = /^.*?\bwoofs\b$/im;
          let regex3 = /^.*?\bfunction\b$/im;
          let regex4 = /^.*?\bpassed\b$/im;
          let regex5 = /^.*?\breturns\b$/im;

          if (
            argument.value?.trim().match(regex) ||
            argument.value?.trim().match(regex2) ||
            argument.value?.trim().match(regex3) ||
            argument.value?.trim().match(regex4) ||
            argument.value?.trim().match(regex5)
          ) {
            testTestPassed = true;
          }
        });
      }
    });

    let expect1TestPassed = false;
    walk.full(ast, (node) => {
      if (node.type === 'CallExpression' && node.callee?.name === 'expect') {
        node.arguments.map((argument) => {
          if (
            argument.type === 'CallExpression' &&
            argument.callee?.name === 'woof'
          ) {
            argument.arguments.map((argument) => {
              if (Number.isInteger(argument.value)) {
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
          if (
            argument.value === 'woof, woof, woof' ||
            argument.value === 'woof,woof,woof'
          ) {
            toBeTestPassed = true;
          }
        });
      }
    });

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
            expect matcher is correct.
            toBe matcher is correct.
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
  }
};

module.exports = allTests;
