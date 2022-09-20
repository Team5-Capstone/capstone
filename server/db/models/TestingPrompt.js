const Sequelize = require('sequelize');
const db = require('../db');

const TestingPrompt = db.define('testingPrompt', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  prompt: {
    type: Sequelize.STRING,
  },
  jsCode: {
    type: Sequelize.STRING,
  },
  templateTest: {
    type: Sequelize.STRING,
    defaultValue: `describe('helloWorld', () => {
      test('returns a string "Hello World"', () => {
          expect( *ADD CODE HERE* ).toBe( *ADD CORE HERE* )
      })
  });`,
  },
});

module.exports = TestingPrompt;
