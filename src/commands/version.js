import pkg from '../../package';
import eslint from '../eslint';

export default {
  trigger(opts) {
    return opts.version;
  },
  async run() {
    const result = await eslint.execute(['--version']);
    const version = pkg.version;

    return `Eslint-Watch: ${version}\nEslint: ${result.trim('\n')}`;
  },
};
