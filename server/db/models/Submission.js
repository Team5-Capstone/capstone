const Sequelize = require('sequelize');
const db = require('../db');

const Submission = db.define('submission', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  fileName: {
    type: Sequelize.STRING,
  },
  // hooks: {
  //   beforeCreate: (submission) => {
  //     submission.fileName = `${submission.userId}-${
  //       submission.promptsId
  //     }-${Date.now()}.js`;
  //   },
  // },
});

module.exports = Submission;
