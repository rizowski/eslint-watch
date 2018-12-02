import createLogger from '../logger';
const logger = createLogger('commands');

const commands = [require('./clear'), require('./version'), require('./versions')];

process.on('unhandledRejection', console.error);
export default {
  async run(options) {
    try {
      const runnable = commands.filter((c) => c.trigger(options));

      logger.debug('Running %o esw commands', runnable.length);

      const result = await Promise.all(
        runnable.map((c) => {
          logger.debug('Running %s', c.name);
          return c.run(options);
        })
      );

      const results = result.join('\n');

      logger.debug('Success results', results);

      return { exitCode: 0, result: results };
    } catch (error) {
      logger.debug('Error Result', error);

      return { exitCode: 1, result: error };
    }
  },
};
