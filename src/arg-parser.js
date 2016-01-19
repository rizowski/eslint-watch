import path from 'path';
import _ from 'lodash';

import Logger from './log';

let logger = Logger('arg-parser');
logger.debug('Loaded');

let simpleDetail = 'simple-detail';
let formatterPath = 'formatters';

let defaultPath = './';
let formatKey = '-f';
let keys = {
  '-w': true,
  '--watch': true
};
let formats = {
  'simple': true,
  'simple-success': true,
  'simple-detail': true
};

function getPath (options) {
  logger.debug('GetPath: %s', options.format);
  return path.join(__dirname, formatterPath, options.format);
};

let parse = (cliArgs, options) => {
  let arr = [];
  let dirs = options._;
  let formatSpecified = false;
  logger.debug('cliArgs: %o', cliArgs);
  let args = _.slice(cliArgs, 2, cliArgs.length);
  logger.debug('args: %o', args);
  logger.debug('Directories to check: %o', dirs);
  _.each(args, item => {
    if (!keys[item] && !formats[item]) {
      logger.debug('Pushing item: %s', item);
      arr.push(item);
    }
    if (formats[item]) {
      formatSpecified = true;
      logger.debug('Format specified');
      arr.push(getPath(options));
    }
  });
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
};

export default { parse };
