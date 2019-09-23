process.env.NODE_ENV = 'test';

module.exports = {
  "extension": [
    "ts"
  ],
  "spec": "test/**/*.spec.ts",
  "require": "ts-node/register"
};
