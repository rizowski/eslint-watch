import pkg from '../../package';
import eslint from '../eslint';

export default {
  name: 'versions',
  trigger(opts) {
    return opts.versions;
  },
  async run() {
    const result = await eslint.execute(['--version']);
    const version = pkg.version;

    return `Eslint-Watch: ${version}\nEslint: ${result.trim('\n')}`;
  },
};
