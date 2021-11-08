const { createLogger } = require('../logger');
const logger = createLogger('commands');

const commands = [require('./clear'), require('./version'), require('./versions')];

module.exports = {
  async run(options) {
    const runnable = commands.filter((c) => c.trigger(options));

    logger.debug('Running %o esw commands', runnable.length);

    const result = await Promise.all(
      runnable.map((c) => {
        logger.debug('Running %s', c.name);
        return c.run(options);
      })
    );

    const results = result.join('\n');

    logger.debug('Success:', results);

    return results;
  },
};
