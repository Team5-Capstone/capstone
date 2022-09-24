function notOverTen(num) {
  if (num <= 10) {
    return true;
  }
}
describe('notOverTen function', () => {
  test('check if values passed exceed 10', () => {
    expect(11).toBeLessThanOrEqual(10);
  });
});
