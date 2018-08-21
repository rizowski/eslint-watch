import executer from './executer';
import parser from '../args-parser';

const eslint = {
  async getHelp() {
    const helpText = await eslint.execute(['--help']);

    const options = parser.parseHelp(helpText);

    return options;
  },
  execute(args = []) {
    return executer.execute('eslint', args);
  },
};

export default eslint;
