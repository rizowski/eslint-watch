import eslint from './eslint';
import options from './cli/options';
import Logger from './logger';
import commands from './commands';

const logger = Logger('main');

export default {
  async run([...rawArgs]) {
    const eswOptions = options.getOptions();
    const eslOptions = await eslint.getHelpOptions();
    const opts = options.createOptions(eswOptions, eslOptions);
    const cliOptions = opts.parse(rawArgs);
    // console.log(cliOptions);

    if (cliOptions.help) {
      logger.log(opts.helpText);
      return;
    }

    try {
      return await commands.run(cliOptions);
    } catch (error) {
      logger.log(opts.helpText);
    }
  },
};
