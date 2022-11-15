const db = require('../db');
const Sequelize = require('sequelize');
const { ARRAY, INTEGER, JSON, TEXT, UUID, UUIDV4 } = Sequelize;

const TestingPrompt = db.define('testingPrompt', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  narrative: {
    type: TEXT,
  },
  prompt: {
    type: TEXT,
  },
  jsCode: {
    type: TEXT,
  },
  templateTest: {
    type: TEXT,
  },
  solution: {
    type: TEXT,
  },
  orderNum: {
    type: INTEGER,
  },
  readOnlyRanges: {
    type: ARRAY(JSON(INTEGER)),
  },
  strikeMarkRanges: {
    type: ARRAY(JSON(INTEGER)),
  },
});

module.exports = TestingPrompt;
