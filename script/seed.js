'use strict';

const {
  db,
  models: { User, TestingPrompt },
} = require('../server/db');

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log('db synced!');

  // Creating Users
  const users = await Promise.all([
    User.create({ username: 'cody', password: '123' }),
    User.create({ username: 'murphy', password: '123' }),
  ]);

  // Creating Prompts
  const prompts = await Promise.all([
    TestingPrompt.create({
      narrative: `Welcome to Exercise #1!
    
It often makes sense to write Unit Tests first and then write as much code as needed to allow the Unit Tests to pass.

Doing this moves towards a practice known as Test-Driven Development (TDD).

Throughout the next 10 exercises, you will not see the javascript code your Unit Test is running against, only a prompt that will provide clues for you to complete the Unit Test.

In this first exercise, you are going to use the expect function with the toBe matcher to complete the unit test below. 

When you're writing tests, you often need to check that values meet certain conditions. Expect gives you access to a number of "matchers" that let you validate different things.

The toBe matcher will test exact equality.  Check out the following example:

test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});

Now, take a look at the prompt and try to fill out the unit test below:
    `,
      prompt: `Please create a function called helloWorld where when a user passes the string “World” to this function, the function console.logs the string “Hello, World!”.
    `,
      jsCode: 'const helloWorld = (str) => { return `Hello ${str}`};',
      templateTest: ` describe('helloWorld', () => {
        test('returns a string "Hello, World!"', () => {
            expect( ADD CODE HERE ).toBe( ADD CODE HERE )
        })
    });
    `,
    }),
    TestingPrompt.create({
      narrative: `Now, let’s examine the toEqual and the not.toBe matchers.

The toEqual matcher will recursively check every field of an object or array.

The not.toBe matcher will test for the opposite of a matcher.
      `,
      prompt: `Please create a function called cloneArray that returns a copy of the original array.`,
      jsCode: `
       function cloneArray(array){
           return [...array]
       };`,
      templateTest: ` test('properly clones an array', () => {
        const array = [1, 2, 3]
        expect( ADD CODE HERE ).toEqual( ADD CODE HERE )
        expect( ADD CODE HERE ).not.toBe( ADD CODE HERE )
    })    
      `,
    }),
    TestingPrompt.create({
      narrative: `Let's use what we learned from the last two exercises and use the prompt to complete the following Unit Test:
      `,
      prompt: `Please create a function called isNumber that returns a boolean (True) if the argument passed to isNumber is an integer and false if the argument passed to isNumber is any other data-type.`,
      jsCode: `
        function isNumber(value){
          return typeof value === 'number'
      };`,
      templateTest: ` describe('isNumber function', () => {
        test('properly checks that the value passed in is a integer', () => {
            expect( ADD CODE HERE ).toBe( ADD CODE HERE )
        });
        
        test("isInteger fails for non-integer value", () => {
            expect( ADD CODE HERE ).toBe( ADD CODE HERE );
        });
      });
       
      `,
    }),
    TestingPrompt.create({
      narrative: `In tests, you sometimes need to distinguish between undefined, null, and false, but you sometimes do not want to treat these differently. Jest contains helpers that let you be explicit about what you want.

toBeNull matches only null
toBeUndefined matches only undefined
toBeDefined is the opposite of toBeUndefined
toBeTruthy matches anything that an if statement treats as true
toBeFalsy matches anything that an if statement treats as false
      
      `,
      prompt: `Please write a function called isTruthy that checks if a value is truthy
      `,
      jsCode: `
        function isTruthy(value){
          if (value == true) {
            return true;
          } 
      };`,
      templateTest: `describe('isTruthy function', () => {
        test('check if value passed is truthy', () => {
        expect( ADD CODE HERE ).toBeTruthy();
    })
  });
      `,
    }),
    TestingPrompt.create({
      narrative: `We can also compare numbers using the following unique matchers:

test('two plus two', () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThanOrEqual(3.5);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4.5);

Please use one of the matchers above to complete the following exercise:
      
      `,
      prompt: `Please create a function called notOverTen that takes a number that does not exceed 10.
      `,
      jsCode: `
      function notOverTen(num){
        if (num <= 10) {
          return true
        }
      };`,
      templateTest: `describe('notOverTen function', () => {
        test('check if value passed exceeds 10', () => {
    expect( ADD CODE HERE ).toBeLessThanOrEqual( ADD CODE HERE )
    });
  })
      `,
    }),
    TestingPrompt.create({
      narrative: `You've probably noticed by now that we have used the function Describe over and over again.

describe(name, fn) creates a block that groups together several related tests. For example, if you have a myLunch object that is supposed to be hot but not spicy, you could test it with:

const myLunch = {
  hot: true,
  spicy: false,
};

describe('my lunch, () => {
  test('is hot', () => {
    expect(myLunch.hot).toBeTruthy();
  });

  test('is not spicy', () => {
    expect(myLunch.hot).toBeFalsy();
  });
});
      `,
      prompt: `Please complete the unit test below by completing the describe function. Use the rest of the unit test for clues.
      `,
      jsCode: `
      const weatherOutside = {
        isCold = true;
        isRaining = false;
    }`,
      templateTest: `const weatherOutside = {
        isCold: true,
        isRaining: false,
    }
    
    describe( ADD CODE HERE , () => {
        test('is cold outside', () => {
        expect( weatherOutside.isCold ).toBeTruthy();
    })
        test('is raining outside', () => {
        expect( weatherOutside.isRaining ).toBeFalsy();
    })
  })
      `,
    }),
    TestingPrompt.create({
      narrative: `Now, let’s explore the test function.

All you need in a test file is the test method which runs a test. For example, let's say there's a function inchesOfSnow() that should be zero. Your whole test could be:

test('did not snow, () => {
  expect(inchesOfSnow()).toBe(0);
});

In the exercise below, fill in the test method.

      `,
      prompt: `Please create a unit test that checks whether apples are on a shopping list.
      `,
      jsCode: `
      function shoppingList(){
        let shoppingList = [apples, oranges, pears];
        return shoppingList
      }`,
      templateTest: `test( ADD CODE HERE, () => {
        let apples;
        expect(shoppingList()).toContain(apples);
        expect(new Set(shoppingList())).toContain(apples);
      });      
           
      `,
    }),
    TestingPrompt.create({
      narrative: `Ok, now that we know the basics, let's try a more advanced exercise. 
      
Based on the prompt below, please fill in the describe, test, expect and toBe functions.

      `,
      prompt: `Please create a Unit Test for a function called Sum that adds two numbers.
      `,
      jsCode: `
      function sum(a, b){
        return a+b
    };`,
      templateTest: `describe(' ADD CODE HERE ', ()=> {
        test(' ADD CODE HERE ', () => {
            expect( ADD CODE HERE ).toEqual(5)
        })
    });
      `,
    }),
    TestingPrompt.create({
      narrative: `Let’s try another example:

      `,
      prompt: `Create a function called charCount that accepts two arguments: a string and a letter. The function should return the correct count of the letter passed into the argument. In this instance, we will pass the string “Hello, World” in as the first argument and the letter, 'l' in as the second argument.
      `,
      jsCode: `    
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
        `,
      templateTest: `describe(' ADD CODE HERE ', () => {
        test(' ADD CODE HERE ', () => {
            expect( ADD CODE HERE )).toBe( ADD CODE HERE )
        })
    });
      `,
    }),
    TestingPrompt.create({
      narrative: `Last exercise!

      `,
      prompt: `Create a function called woof that accepts one argument: a number. This function returns the number of woofs passed to it. In this exercise, you will pass the woof function the number 3, returning 3 'woofs'.
      `,
      jsCode: `    
                  const woof = (num) => {
                    if(typeof num === 'string'){
                        return null
                    }
                    else {
                        const woofStr = [];
                        for(let i = num; i > 0; i-- ){
                            woofStr.push('woof')
                        }
                        return woofStr.join(' ')
                    }
                }
        `,
      templateTest: `describe( ' ADD CODE HERE ', () => {
        test(' ADD CODE HERE ', () => {
            expect( ADD CODE HERE ).toBe( ADD CODE HERE )
        })
    });    
      `,
    }),
  ]);

  console.log(`seeded ${users.length} users`);
  console.log(`seeded ${prompts.length} prompts`);
  console.log(`seeded successfully`);
  return {
    users: {
      cody: users[0],
      murphy: users[1],
    },
    prompts,
  };
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
