'use strict';

var eslint = require('./cli');
var _ = require('lodash');
var logger = require('../log')('eslint-help');
logger.debug('Loaded');

function parseNo(option, str){
  if(!str) return;
  var cmd = str.replace('--', '');
  if(/no-/.test(cmd)){
    logger.debug('Parsing no option', str);
    cmd = cmd.replace('no-', '');
    option.default = 'true';
  }
  option.option = cmd;
  return option;
}

function parseRegular(arr){
  logger.debug('Parsing %s', arr[0]);
  if(!arr[0]){
    return;
  }
  var optionText = arr[0];
  var type = arr[1];
  var option = {};
  option = parseNo(option, optionText);

  option.type = type ? type : 'Boolean';

  var helpText = _.without(arr, optionText, type, '');

  var description = helpText.join(' ');
  if(description){
    option.description = description;
  }
  return option;
}

function parseAlias(arr){
  var alias = arr[0];
  logger.debug('Alias found: %s', alias);
  var option = parseRegular(_.without(arr, alias));

  if(alias){
    option.alias = alias.replace('-','');
  }
  return option;
}

function createOption(arr){
  var noAlias = /^--/.test(arr[0]);
  logger.debug('noAlias', noAlias);
  var option = noAlias ? parseRegular(arr) : parseAlias(arr);
  var isEmpty = _.isEmpty(option);
  return isEmpty ? undefined : option;
}

function parseHelp(helpText){
  var helpArr = helpText.split('\n');
  var newArr = [];
  var previousLine = [];
  _.each(helpArr, function(row, index){
    if(index <= 2){
      return;
    } else {
      var str = row.replace(',', '');
      var arr = str.trim().split(' ');
      if(str.indexOf('-') >= 0 && previousLine[0] !== ''){
        var option = createOption(arr);
        if(option && option.option !== 'format' && option.option !== 'help'){
          newArr.push(option);
        }
      }
      previousLine = arr;
    }
  });
  return newArr;
}

// rewrite in es6 this callback yucky stuff goes away.
module.exports = function(cllbk){
  logger.debug('Executing help');
  var spawn = eslint(['--help'], { help: true }, { });
  spawn.stdout.on('data', function(msg){
    logger.debug('Help text received');
    var eslintHelp = msg.toString();
    cllbk(parseHelp(eslintHelp));
  });
};
