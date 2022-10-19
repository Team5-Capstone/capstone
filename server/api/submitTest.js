const fs = require('fs');
const router = require('express').Router();
const util = require('util');
const {
  models: { TestingPrompt },
} = require('../db');

router.post('/', async (req, res) => {
  let findJsCode = await TestingPrompt.findOne({
    where: {
      jsCode: req.body.jsCode,
    },
  });

  const jsCode = findJsCode.dataValues.jsCode;

  if (req.body.passedTest === 'true') {
    req.body.id = req.body.id + '.test.js';
    fs.writeFile(
      './testFiles/' + req.body.id,
      jsCode + '\n' + '\n' + req.body.code,
      function (err) {
        if (err) throw err;
      },
    );

    try {
      const exec = util.promisify(require('child_process').exec);
      const { stderr } = await exec(`npm test ${req.body.id}`);
      res.json(stderr.toString());
    } catch (err) {
      res.send(err.toString());
    } finally {
      fs.unlinkSync('./testFiles/' + req.body.id, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('success!');
        }
      });
    }
  }
});

module.exports = router;
