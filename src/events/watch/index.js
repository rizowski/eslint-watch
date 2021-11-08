const path = require('path');
const debounce = require('lodash.debounce');

const watch = require('./chokidar');
const { createLogger } = require('../../logger');
const eslint = require('../../eslint');
const key = require('./key-listener');
const clear = require('../../commands/clear');
const cli = require('../../cli/options');

const logger = createLogger('events:watch');

async function lint(options = {}, eslintArgs = []) {
  if (options.clear) {
    /* istanbul ignore next */
    logger.log(clear.run());
  }

  await eslint.lint(eslintArgs, options);
}

module.exports = {
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
        .on(
          'change',
          debounce(async (filePath) => {
            if (cacheLocation === filePath) {
              return;
            }

            if (!opts.ext.includes(path.extname(filePath))) {
              logger.debug(`Watch: Skipping ${filePath}`);
              return;
            }

            logger.debug('Detected change:', filePath);
            const changed = opts.changed ? [filePath] : opts._;

            await lint(opts, [...flags, ...changed]);
          }, opts.watchDelay || 300)
        )
        /* istanbul ignore next */
        .on('error', (err) => logger.error(err))
    );
  },
};
