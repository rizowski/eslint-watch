'use strict';
var chalk = require('chalk');

module.exports = function (results) {
  var message = '';
  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    if (result.errorCount === 0 && result.warningCount === 0) {
      message += chalk.white(result.filePath) + ' ' + chalk.green('(0) Errors | (0) Warnings') + '\n';
    } else {
      message += chalk.white(result.filePath) + ' ';
      message += chalk.red('(' + result.errorCount + ') Errors') + ' | ';
      message += chalk.yellow('(' + result.warningCount + ') Warnings');
      message += '\n';
    }
  }
  return message;
};
