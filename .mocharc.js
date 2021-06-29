module.exports = {
  timeout: '10000',
  recursive: true,
  retries: 3,
  parallel: true,
  require: ['core-js/stable', '@babel/core', '@babel/register', 'tests/globals'],
};
