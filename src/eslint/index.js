import parser from './parser';
import Logger from '../logger';
import execa from 'execa';

const logger = Logger('eslint');

const eslint = {
  async getHelpOptions() {
    const helpText = await eslint.execute(['--help']);

    return parser.parseHelp(helpText);
  },
  async execute(args = []) {
    logger.debug('Executing %o', args);
    try {
      const { stdout } = await execa('eslint', args);

      return stdout;
    } catch (error) {
      throw new Error(error.stdout);
    }
  },
  async lint(args = []) {
    try {
      let endLine = '';
      const { result } = await eslint.execute(args);

      if (!result.trim()) {
        logger.log(`✓ Clean (${new Date().toLocaleTimeString()})`);
        return;
      }

      if (!/\\n{2}$/.test(result)) {
        endLine = '\n';
      }

      logger.log(`${result}${endLine}`);
    } catch (error) {
      logger.error(error);
    }
  },
};

export default eslint;
