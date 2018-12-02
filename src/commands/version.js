import pkg from '../../package';

export default {
  name: 'version',
  trigger(opts) {
    return opts.version;
  },
  async run() {
    const version = pkg.version;

    return `Eslint-Watch: ${version}`;
  },
};
