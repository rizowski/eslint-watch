let path = require('path');
let _ = require('lodash');
let logger = require('./log')('arg-parser');
logger.debug('Loaded');

let simpleDetail = 'simple-detail';
let formatterPath = 'formatters';

let defaultPath = './';
let formatKey = '-f';
let keys = {
  '-w': true,
  '--watch': true,
  '--full-lint': true
};
let formats = { // still don't like this can cause too much duplication
  'simple': true,
  'simple-success': true,
  'simple-detail': true
};

let getPath = function(options){
  logger.debug('GetPath: %s', options.format);
  return path.join(__dirname, formatterPath, options.format);
};

module.exports = {
  parse: function (cliArgs, options) {
    let arr = [];
    let dirs = options._;
    let formatSpecified = false;
    let args = _.slice(cliArgs, 2, cliArgs.length);
    logger.debug('Directories to check: %o', dirs);
    logger.debug('Args %o', args);
    _.each(args, function(item){
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
  }
};
