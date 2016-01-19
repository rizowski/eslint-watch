import _ from 'lodash';

import eslint from './cli';
import Logger from '../log';

let logger = Logger('eslint-help');
logger.debug('Loaded');

function parseRegular(arr){
  logger.debug('Parsing %s', arr[0]);
  if(!arr[0]){
    return;
  }
  let optionText = arr[0];
  let type = arr[1];
  let option = {};
  option.option = optionText.replace('--', '');
  option.type = type ? type : 'Boolean';

  let helpText = _.without(arr, optionText, type, '');

  let description = helpText.join(' ');
  if(description){
    option.description = description;
  }
  return option;
}

function parseAlias(arr){
  let alias = arr[0];
  logger.debug('Alias found: %s', alias);
  let option = parseRegular(_.without(arr, alias));

  if(alias){
    option.alias = alias.replace('-','');
  }
  return option;
}

function createOption(arr){
  let noAlias = arr[0].match(/--\w/);
  let option = noAlias ? parseRegular(arr) : parseAlias(arr);
  let isEmpty = _.isEmpty(option);
  return isEmpty ? undefined : option;
}

function parseHelp(helpText){
  let helpArr = helpText.split('\n');
  let newArr = [];
  let previousLine = [];
  _.each(helpArr, (row, index) => {
    if(index === 0 || index === 1 || index === 2){
      return;
    } else {
      let str = row.replace(',', '');
      let arr = str.trim().split(' ');
      if(str.indexOf('-') >= 0 && previousLine[0] !== ''){
        let option = createOption(arr);
        if(option && option.option !== 'format' && option.option !== 'help'){
          newArr.push(option);
        }
      }
      previousLine = arr;
    }
  });
  return newArr;
}

export default () => {
  logger.debug('Executing help');

  return new Promise((resolve) => {
    let spawn = eslint(['--help'], { help: true }, { });

    spawn.stdout.on('data', msg => {
      logger.debug('Help text received');
      let eslintHelp = msg.toString();
      resolve(parseHelp(eslintHelp));
    });
  });
};
