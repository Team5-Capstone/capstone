//this is the access point for all things database related!

const db = require('./db');
const User = require('./models/User');
const TestingPrompt = require('./models/TestingPrompt');
const Submission = require('./models/Submission');

//associations could go here!
Submission.belongsTo(User);
Submission.belongsTo(TestingPrompt);

module.exports = {
  db,
  models: {
    User,
    TestingPrompt,
    Submission,
  },
};
