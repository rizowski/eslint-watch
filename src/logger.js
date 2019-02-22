import debug from 'debug';

export default {
  createLogger(thing) {
    return {
      log: console.log,
      error: console.error,
      debug: debug(`esw:${thing}`),
    };
  },
};
