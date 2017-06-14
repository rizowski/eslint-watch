import _ from 'lodash';

import Logger from '../logger';
import eslint from './cli';

const logger = Logger('eslint-help');
logger.debug('Loaded');

const namedOption = /^--/;

function parseNo(option, str){
  if(!str) return;

  let cmd = str.replace('--', '');
  if(/no-/.test(cmd)){
    logger.debug('Parsing no option', str);
    cmd = cmd.replace('no-', '');
    option.default = 'true';
  }
  option.option = cmd;
  return option;
}

function parseDouble(arr){
  let description = _.without(arr.slice(2),'').join(' ');
  return {
    option: arr[0].replace('--', ''),
    type: 'Boolean',
    alias: arr[1].replace('--', ''),
    description: description
  };
}

function parseRegular(arr){
  logger.debug('Parsing %s', arr[0]);
  if(!arr[0]){
    return;
  }
  let optionText = arr[0];
  let type = arr[1] || 'Boolean';
  let option = {};
  option = parseNo(option, optionText);

  option.type = type;

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
  let option;

  if(namedOption.test(arr[0]) && namedOption.test(arr[1])){ // no alias defaulted boolean
    option = parseDouble(arr);
  } else if(namedOption.test(arr[0]) && !namedOption.test(arr[1])){ // just a no alias
    option = parseRegular(arr);
  } else {// aliased or other
    option = parseAlias(arr);
  }
  let isEmpty = _.isEmpty(option);
  return isEmpty ? undefined : option;
}

function parseHelp(helpText){
  let helpArr = helpText.split('\n');
  let newArr = [];
  let previousLine = [];
  _.each(helpArr, function(row, index){
    if(index <= 2){
      return;
    }
    let str = row.replace(',', '');
    let arr = str.trim().split(' ');
    if(str.indexOf('-') >= 0 && previousLine[0] !== ''){
      let option = createOption(arr);
      if(option && option.option !== 'format' && option.option !== 'help'){
        newArr.push(option);
      }
    }
    previousLine = arr;

  });
  return newArr;
}

export default function eslintHelp(){
  logger.debug('Executing help');
  const result = eslint(['--help'], { stdio: [ process.stdin, null, process.stderr] });
  if(!result.message){
    throw new Error('Help text not received from Eslint.');
  }
  const eslintOptions = parseHelp(result.message);
  return eslintOptions;
};
