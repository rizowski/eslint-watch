const parser = require('./parser');
const Logger = require('../logger');
const execa = require('execa');

const eslint = {
  async getHelpOptions() {
    const helpText = await eslint.execute(['--help'], { color: false });

    return parser.parseHelp(helpText);
  },
  async execute(args = [], cliOptions = {}) {
    const logger = Logger.createLogger('eslint');

    logger.debug('Executing %o', args);

    const env = cliOptions.color ? { FORCE_COLOR: cliOptions.color } : {};

    try {
      const result = await execa('eslint', args, { env: { ...process.env, ...env } });

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
      const results = await eslint.execute(args, cliOpts);

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

module.exports = eslint;
