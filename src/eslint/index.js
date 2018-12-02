import executer from './executer';
import parser from './parser';
import Logger from '../logger';

const logger = Logger('eslint');

const eslint = {
  async getHelpOptions() {
    const { result: helpText } = await eslint.execute(['--help']);

    return parser.parseHelp(helpText);
  },
  async execute(args = []) {
    logger.debug('Executing %o', args);
    try {
      return { result: await executer.execute('eslint', args), exitCode: 0 };
    } catch (error) {
      return { result: error, exitCode: 1 };
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
