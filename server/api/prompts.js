const router = require('express').Router();
const {
  models: { TestingPrompt },
} = require('../db');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const prompts = await TestingPrompt.findAll();
    res.send(prompts);
  } catch (ex) {
    next(ex);
  }
});
