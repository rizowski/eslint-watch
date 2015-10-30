'use strict';
var chokidar = require('chokidar');
var eslint = require('eslint');
var chalk = require('chalk');

var success = require('./formatters/helpers/success');
var formatter = require('./formatters/simple-detail');
var logger = require('./log')('watcher');
logger.debug('Loaded');

var events = {
  change: 'change'
};

var cli = new eslint.CLIEngine();

function successMessage(result) {
  logger.debug('result: %o', result);
  if (!result.errorCount && !result.warningCount) {
    return success(result) + chalk.grey(' (' + new Date().toLocaleTimeString() + ')');
  }
  return '';
}

function lintFile(path, config) {
  logger.debug('lintFile: %s', path);
  var results = cli.executeOnFiles([path], config).results;
  logger.log(successMessage(results[0]));
  logger.log(formatter(results));
}

module.exports = function watcher(options) {
  chokidar.watch(options._)
    .on(events.change, function (path) {
      logger.debug('Changed:', path);
      if(!cli.isPathIgnored(path)){
        var config = cli.getConfigForFile(path);
        lintFile(path, config);
      }
    }).on('error', function(err){
      logger.log(err);
    });

  logger.debug('Watching: %o', options._);
};
