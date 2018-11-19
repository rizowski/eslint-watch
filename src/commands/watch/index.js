import watch from './watch';
import Logger from '../../logger';
import eslint from '../../eslint';

const logger = Logger('command:watch');

export default {
  trigger(opts) {
    return opts.watch;
  },
  run(opts) {
    const watcher = watch.createWatcher(opts._);

    watcher
      .on('ready', async () => await eslint.lint(opts._))
      .on('add', (dir) => logger.debug(`${dir} added.`))
      .on('change', async (path) => await eslint.lint([path]))
      .on('error', (err) => logger.error(err));
  },
};
