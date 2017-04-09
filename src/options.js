import optionator from 'optionator';
import _ from 'lodash';

import getOptions from './eslint/help';
import Logger from './logger';

const logger = Logger('options');
logger.debug('Loaded');

const settings = {
  prepend: 'esw [options] [file.js ...] [dir ...]',
  concatRepeatedArrays: true,
  mergeRepeatedObjects: true
};

const myOptions = [{
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
}, {
  option: 'changed',
  type: 'Boolean',
  description: 'Enables single file linting while watch is enabled'
}, {
  option: 'clear',
  type: 'Boolean',
  description: 'Clear terminal when running lint'
}, {
  option: 'esw-version',
  type: 'Boolean',
  description: "Prints Eslint-Watch's Version"
}];

const eslintOptions = getOptions();
const newOptions = _.union(myOptions, eslintOptions);
settings.options = newOptions;

export default optionator(settings);
