import path from 'path';

import watch from './chokidar';
import { createLogger } from '../../logger';
import eslint from '../../eslint';
import key from './key-listener';
import clear from '../../commands/clear';
import cli from '../../cli/options';

const logger = createLogger('events:watch');

async function lint(options = {}, eslintArgs = []) {
  if (options.clear) {
    /* istanbul ignore next */
    logger.log(clear.run());
  }

  await eslint.lint(eslintArgs, options);
}

export default {
  listen(opts) {
    const watcher = watch.createWatcher(opts._, { ignored: opts.watchIgnore });
    const { flags, dirs } = cli.getCli(opts);
    const cacheLocation = path.relative(process.cwd(), path.resolve(opts.cacheLocation || '.eslintcache'));

    key.listen(['enter'], async () => {
      await lint(opts, [...flags, ...dirs]);
    });

    return (
      watcher
        .on('ready', async () => {
          logger.debug('Ready');
          await lint(opts, [...flags, ...dirs]);
        })
        /* istanbul ignore next */
        .on('add', (dir) => logger.debug(`${dir} added.`))
        .on('change', async (filePath) => {
          if (cacheLocation === filePath)
            return;

          logger.debug('Detected change:', filePath);
          const changed = opts.changed ? [filePath] : opts._;

          await lint(opts, [...flags, ...changed]);
        })
        /* istanbul ignore next */
        .on('error', (err) => logger.error(err))
    );
  },
};
