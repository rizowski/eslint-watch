const eslint = require('../eslint');
const version = require('./version');

module.exports = {
  name: 'versions',
  trigger(opts) {
    return !opts.version && opts.versions;
  },
  async run() {
    const result = await eslint.execute(['--version']);

    return `${version.run()}\nEslint: ${result.trim('\n')}`;
  },
};
