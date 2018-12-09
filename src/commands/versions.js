import eslint from '../eslint';
import version from './version';

export default {
  name: 'versions',
  trigger(opts) {
    return !opts.version && opts.versions;
  },
  async run() {
    const result = await eslint.execute(['--version']);

    return `${version.run()}\nEslint: ${result.trim('\n')}`;
  },
};
