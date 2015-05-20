'use strict';
var chalk = require('chalk');
module.exports = function(result){
  return chalk.green('✓') + ' ' +
    chalk.white(result.filePath);
};
