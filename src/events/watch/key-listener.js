/* istanbul ignore file */
import keypress from 'keypress';
import { createLogger } from '../../logger';

const logger = createLogger('events:key-listener');

export default {
  listen(keys = [], cllbk) {
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
