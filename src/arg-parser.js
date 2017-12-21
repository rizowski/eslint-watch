import path from 'path';
import _ from 'lodash';

import Logger from './logger';

const logger = Logger('arg-parser');
logger.debug('Loaded');

const simpleDetail = 'simple-detail';
const formatterPath = 'formatters';

const defaultPath = './';
const formatKey = '-f';
const keys = [
  '-w',
  '--watch',
  '--changed',
  '--clear',
  '--esw-version'
];
const formats = [
  'simple',
  'simple-success',
  simpleDetail
];

function getPath(options) {
  logger.debug('GetPath: %s', options.format);
  const formatPath = path.join(__dirname, formatterPath, options.format);
  logger.debug(formatPath);
  return formatPath;
};

export default {
  parse(cliArgs, options) {
    const dirs = options._;
    let formatSpecified = false;
    const args = _.slice(cliArgs, 2, cliArgs.length);
    logger.debug('Directories to check: %o', dirs);
    logger.debug('Args %o', args);
    const arr = _.without(_.map(args, (item) => {
      if (!_.includes(keys, item) && !_.includes(formats, item)) {
        logger.debug('Pushing item: %s', item);
        return item;
      }
      if (_.includes(formats, item)) {
        formatSpecified = true;
        logger.debug('Format specified');
        return getPath(options);
      }
    }), undefined);

    if (options.format === simpleDetail && !formatSpecified) {
      logger.debug('setting custom formatter');
      arr.push(formatKey);
      arr.push(getPath(options));
    }
    if (!dirs.length) {
      arr.push(defaultPath);
      logger.debug('Setting default path: %s', defaultPath);
    }
    return arr;
  }
};
