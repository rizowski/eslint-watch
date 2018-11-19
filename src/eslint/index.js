import executer from './executer';
import parser from './parser';
import Logger from '../logger';

const logger = Logger('eslint');

const eslint = {
  async getHelpOptions() {
    const helpText = await eslint.execute(['--help']);

    return parser.parseHelp(helpText);
  },
  execute(args = []) {
    return executer.execute('eslint', args);
  },
  async lint(args = []) {
    try {
      const result = await eslint.execute(args);
      logger.log(result);
    } catch (error) {
      logger.error(error);
    }
  },
};

export default eslint;
