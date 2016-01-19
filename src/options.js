import optionator from 'optionator';
import { help as getEslintOptions } from './eslint';
import _ from 'lodash';
import Logger from './log';

let logger = Logger('options');
logger.debug('Loaded');

let settings = {
  prepend: 'esw [options] [file.js ...] [dir ...]',
  concatRepeatedArrays: true,
  mergeRepeatedObjects: true
};

let myOptions = [{
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
}];

export default () => {
  return getEslintOptions()
    .then(eslintOptions => {
      settings.options = _.union(myOptions, eslintOptions);
      return optionator(settings);
    });
};
