import pkg from '../package';

import eslint from './eslint';
import options from './cli/options';
import { createLogger } from './logger';
import commands from './commands';
import watch from './events/watch';

const logger = createLogger('main');

export default {
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
      return await commands.run(cliOptions);
    }

    let cmdResult = await commands.run(cliOptions);

    if (cliOptions.watch) {
      return watch.listen(cliOptions);
    }

    const { flags, dirs } = options.getCli(cliOptions);

    const lintResult = await eslint.execute([...flags, ...dirs]);

    return `${cmdResult || ''}${lintResult || ''}`;
  },
};
