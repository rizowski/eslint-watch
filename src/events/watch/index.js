import watch from './watch';
import Logger from '../../logger';
import eslint from '../../eslint';
import key from './key-listener';
import clear from '../../commands/clear';
import cli from '../../cli/options';

const logger = Logger('events:watch');

async function lint(options = {}, eslintArgs = []) {
  if (options.clear) {
    logger.log(clear.run());
  }

  await eslint.lint(eslintArgs);
}

export default {
  listen(opts) {
    const watcher = watch.createWatcher(opts._, { ignored: opts.watchIgnore });
    const { flags, dirs } = cli.getCli(opts);

    key.listen(['enter'], async () => {
      await lint(opts, [...flags, ...dirs]);
    });

    watcher
      .on('ready', async () => {
        logger.debug('Ready');
        await lint(opts, [...flags, ...dirs]);
      })
      .on('add', (dir) => logger.debug(`${dir} added.`))
      .on('change', async (path) => {
        logger.debug('Detected change:', path);
        const dirs = opts.changed ? [path] : opts._;

        await lint(opts, [...flags, ...dirs]);
      })
      .on('error', (err) => logger.error(err));
  },
};
