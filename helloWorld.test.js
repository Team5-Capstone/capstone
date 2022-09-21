const helloWorld = (str) => {
  return `Hello, ${str}!`;
};
describe('helloWorld', () => {
  test('returns a string "Hello World"', () => {
    expect(helloWorld('World')).toBe('Hello, World!');
  });
});
