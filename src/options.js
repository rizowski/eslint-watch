'use strict';
var optionator = require('optionator');
var chalk = require('chalk');

module.exports = optionator({
  prepend: 'esw [options] [file.js ...] [dir ...]',
  append: chalk.yellow('Any commands above override any commands ESLint lists below:'),
  concatRepeatedArrays: true,
  mergeRepeatedObjects: true,
  options: [{
    heading: 'Options'
  }, {
    option: 'help',
    alias: 'h',
    type: 'Boolean',
    description: 'Show help'
  }, {
    option: 'format',
    alias: 'f',
    type: 'String',
    default: 'simple-detail',
    description: 'Use a specific output format'
  }, {
    option: 'watch',
    alias: 'w',
    type: 'Boolean',
    description: 'Enable file watch'
    }]
});
