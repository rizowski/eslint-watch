'use strict';
var chalk = require('chalk');
var c = require('./characters');
var space = ' ';

module.exports = function(result){
  return chalk.green(c.check) + space + chalk.white(result.filePath);
};
