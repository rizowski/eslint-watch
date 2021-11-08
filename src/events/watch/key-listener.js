/* istanbul ignore file */
const keypress = require('keypress');
const { createLogger } = require('../../logger');

const logger = createLogger('events:key-listener');

module.exports = {
  listen(keys, cllbk) {
    keys = keys || [];
    if (!process.stdin.setRawMode) {
      logger.debug('Process might be wrapped exiting keybinding');
      return;
    }

    keypress(process.stdin);

    process.stdin.on('keypress', (char, key) => {
      logger.debug('%s was pressed', key ? key.name : char);

      if (!key) {
        return;
      }

      if (keys.includes(key.name)) {
        cllbk();
      }

      if (key.ctrl && key.name === 'c') {
        process.exit();
      }
    });
  },
};
