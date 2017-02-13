var optionator = require('optionator');
var getOptions = require('./eslint/help');
var _ = require('lodash');
var logger = require('./logger')('options');
logger.debug('Loaded');

var settings = {
  prepend: 'esw [options] [file.js ...] [dir ...]',
  concatRepeatedArrays: true,
  mergeRepeatedObjects: true
};

var myOptions = [{
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
},{
  option: 'changed',
  type: 'Boolean',
  description: 'Enables single file linting while watch is enabled'
},{
  option: 'esw-version',
  type: 'Boolean',
  description: "Prints Eslint-Watch's Version"
}];

const eslintOptions = getOptions();
const newOptions = _.union(myOptions, eslintOptions);
settings.options = newOptions;

module.exports = optionator(settings);
