import parser from './parser';
import Logger from '../logger';
import execa from 'execa';

const eslint = {
  async getHelpOptions() {
    const helpText = await eslint.execute(['--help']);

    return parser.parseHelp(helpText);
  },
  async execute(args = []) {
    const logger = Logger.createLogger('eslint');

    logger.debug('Executing %o', args);

    try {
      const result = await execa('eslint', args);

      logger.debug(result);

      return result.stdout;
    } catch (error) {
      logger.debug(error);

      if (error.errno === 'ENOENT' && error.path === 'eslint') {
        throw new Error("Error: Eslint was not found either globally or locally.\nRun 'npm i -g eslint' or 'npm i -D eslint' to resolve the issue.");
      }

      throw new Error(error.stdout || error.stderr);
    }
  },
  async lint(args = [], cliOpts = {}) {
    const logger = Logger.createLogger('eslint');

    try {
      let endLine = '';
      const results = await eslint.execute(args);

      if (!results.trim()) {
        if (!cliOpts.quiet) {
          logger.log(`✓ Clean (${new Date().toLocaleTimeString()})`);
        }
        return;
      }

      if (!/\\n{2}$/.test(results)) {
        endLine = '\n';
      }

      logger.log(`${results}${endLine}`);
    } catch (error) {
      logger.error(error.message.trim());
    }
  },
};

export default eslint;
