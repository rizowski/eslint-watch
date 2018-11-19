import path from 'path';
import Logger from '../../logger';

const logger = Logger('cli:override');
const keys = ['-w', '--version', '--watch'];
const defaultPath = './';

export default {
  overrideArgs(args, dirs = []) {
    logger.debug('Directories to check: %o', dirs);
    logger.debug('Args %o', args);

    const arr = args.reduce((arr, item) => {
      if (!keys.includes(item)) {
        logger.debug('Pushing item: %s', item);
        arr.push(item);
      }
      return arr;
    }, []);

    if (dirs.length === 0) {
      arr.push(path.resolve(defaultPath));
    }

    return arr;
  },
};
