const debug = require('debug');

module.exports = {
  createLogger(thing) {
    return {
      log: console.log,
      error: console.error,
      debug: debug(`esw:${thing}`),
    };
  },
};
