
process.env.NODE_ENV = 'test';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./test/setup.ts'],
  testRegex: 'test/.*.spec.ts$',
};
