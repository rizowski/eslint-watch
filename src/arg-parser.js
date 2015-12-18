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
let formats = { // still don't like this can cause too much duplication
  'simple': true,
  'simple-success': true,
  'simple-detail': true
};
let bin = {
  node: 'node',
  iojs: 'iojs',
  esw: 'esw'
};

function getPath (options) {
  logger.debug('GetPath: %s', options.format);
  return path.join(__dirname, formatterPath, options.format);
};

function contains(str, items){
  logger.debug('Contains: %s', str);
  return _.some(items, item => {
    return str.indexOf(item) >= 0;
  });
};

let parse = (args, options) => {
  let arr = [];
  let dirs = options._;
  let formatSpecified = false;
  logger.debug('args: %o', args);
  logger.debug('Directories to check: %o', dirs);
  _.each(args, item => {
    if (!keys[item] && !formats[item] && !bin[item] && !contains(item, [bin.esw, bin.iojs, bin.node])) {
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
