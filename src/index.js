import eslint from './eslint';
import options from './cli/options';
import Logger from './logger';
import commands from './commands';
import watch from './events/watch';

const logger = Logger('main');

export default {
  async run([...rawArgs]) {
    const eswOptions = options.getOptions();
    const eslOptions = await eslint.getHelpOptions();
    const opts = options.createOptions(eswOptions, eslOptions);
    const cliOptions = opts.parse(rawArgs);

    if (cliOptions.help) {
      logger.debug('Printing help');
      logger.log(opts.helpText);
      return;
    }

    try {
      if (cliOptions.version || cliOptions.versions) {
        return await commands.run(cliOptions);
      }

      let cmdResult = await commands.run(cliOptions);

      if (cliOptions.clear)
        if (cliOptions.watch) {
          return watch.listen(cliOptions);
        }

      const { flags, dirs } = options.getCli(cliOptions);

      const lintResult = await eslint.execute([...flags, ...dirs]);

      return { result: `${cmdResult.result}\n${lintResult.result}`, exitCode: cmdResult.exitCode + lintResult.exitCode };
    } catch (error) {
      logger.debug(error);
      logger.log(opts.helpText);
    }
  },
};
