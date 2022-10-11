const Sequelize = require('sequelize');
const db = require('../db');

const TestingPrompt = db.define('testingPrompt', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  orderNum: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
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
  solution: {
    type: Sequelize.TEXT,
  },
  orderNum: {
    type: Sequelize.INTEGER,
  },
});

module.exports = TestingPrompt;
