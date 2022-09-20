const Sequelize = require('sequelize');
const db = require('../db');

const TestingPrompt = db.define('testingPrompt', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  narrative: {
    type: Sequelize.TEXT,
  },
  prompt: {
    type: Sequelize.TEXT,
  },
  jsCode: {
    type: Sequelize.TEXT,
  },
  templateTest: {
    type: Sequelize.TEXT,
  },
});

module.exports = TestingPrompt;
