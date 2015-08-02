'use strict';

var eslint = require('./eslint-cli');

module.exports = function(options, parsedOptions){
  console.log(options.generateHelp() + '\n');
  eslint(['--help'], parsedOptions);
};
