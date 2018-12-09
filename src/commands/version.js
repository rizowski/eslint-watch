import pkg from '../../package';

export default {
  name: 'version',
  trigger(opts) {
    return opts.version && !opts.versions;
  },
  run() {
    const version = pkg.version;

    return `Eslint-Watch: v${version}`;
  },
};
