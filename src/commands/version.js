const pkg = require('../../package');

module.exports = {
  name: 'version',
  trigger(opts) {
    return opts.version && !opts.versions;
  },
  run() {
    const { version } = pkg;

    return `Eslint-Watch: v${version}`;
  },
};
