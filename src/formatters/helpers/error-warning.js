'use strict';
var chalk = require('chalk');
module.exports = function(result){
  if(result.errorCount || result.warningCount){
    return chalk.red(result.errorCount) + '/' +
      chalk.yellow(result.warningCount) + ' ' +
      chalk.white(result.filePath);
  } else {
    return chalk.red(result.messages.length) + ' ' +
      chalk.white(result.filePath);
  }
};
