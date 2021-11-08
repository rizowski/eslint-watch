const pkg = require('../package');

const eslint = require('./eslint');
const options = require('./cli/options');
const { createLogger } = require('./logger');
const commands = require('./commands');
const watch = require('./events/watch');

const logger = createLogger('main');

module.exports = {
  async run([, , ...rawArgs]) {
    logger.debug(rawArgs);
    logger.debug(`ESW: v${pkg.version}`);

    const eslOptions = await eslint.getHelpOptions();
    const opts = options.createOptions(options.eswOptions, eslOptions);
    const cliOptions = opts.parse(rawArgs);

    logger.debug(cliOptions);

    if (cliOptions.help) {
      logger.debug('Printing help');
      return opts.helpText;
    }

    if (cliOptions.version || cliOptions.versions) {
      return commands.run(cliOptions);
    }

    const cmdResult = await commands.run(cliOptions);

    if (cliOptions.watch) {
      watch.listen(cliOptions);
      return;
    }

    const { flags, dirs } = options.getCli(cliOptions);

    const lintResult = await eslint.execute([...flags, ...dirs]);

    return `${cmdResult || ''}${lintResult || ''}`;
  },
};
