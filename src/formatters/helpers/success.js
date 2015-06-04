'use strict';
var chalk = require('chalk');
var check = '\u2713';
var space = ' ';

module.exports = function(result){
  return chalk.green(check) + space + chalk.white(result.filePath);
};
