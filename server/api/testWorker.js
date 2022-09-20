const { runCLI } = require('jest');

runCLI(
  {
    runInBand: true,
  },
  [process.cwd()],
).then((result) => {
  console.log('result', result);
});
