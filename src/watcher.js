'use strict';
var chokidar = require('chokidar');
var eslint = require('eslint');
var chalk = require('chalk');
var _ = require('lodash');
var path = require('path');

var success = require('./formatters/helpers/success');
var formatter = require('./formatters/simple-detail');
var logger = require('./log')('watcher');
logger.debug('Loaded');

var events = {
  change: 'change'
};
var chokidarOptions = {
  ignored: /\.git|node_modules|bower_components/
};

function successMessage(result) {
  logger.debug('result: %o', result);
  if (!result.errorCount && !result.warningCount) {
    return success(result) + chalk.grey(' (' + new Date().toLocaleTimeString() + ')');
  }
  return '';
}

///https://github.com/eslint/eslint/blob/233440e524aa41545b66b2c3c7ca26fe790e32e0/tests/lib/cli-engine.js#L105-L107

module.exports = function watcher(options) {
  var cliOptions = {
    config: options.config
  };
  logger.debug(cliOptions);
  logger.debug(options);
  var cli = new eslint.CLIEngine(cliOptions);

  function lintFile(path) {
    logger.debug('lintFile: %s', path);
    var results = cli.executeOnFiles([path]).results;
    logger.log(successMessage(results[0]));
    logger.log(formatter(results));
  }

  function isWatchableExtension(filePath, extensions) {
    if (extensions) {
      return _.contains(extensions, path.extname(filePath));
    }

    // Use the ESLint default extension, if none is provided
    return _.contains(cli.options.extensions, path.extname(filePath));
  }

  chokidar.watch(options._, chokidarOptions)
    .on(events.change, function (path) {
      logger.debug('Changed:', path);
      if (!cli.isPathIgnored(path) && isWatchableExtension(path, options.ext)) {
        lintFile(path);
      }
    }).on('error', function(err){
      logger.log(err);
    });

  logger.debug('Watching: %o', options._);
};
