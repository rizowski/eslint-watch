'use strict';

var eslint = require('./cli');
var _ = require('lodash');
var logger = require('../log');

function createOption(arr){
  var noAlias = arr[0].match(/--\w/);
  var option = noAlias ? parseRegular(arr) : parseAlias(arr);
  var isEmpty = _.isEmpty(option);
  return isEmpty ? undefined : option;
}

function parseAlias(arr){
  var alias = arr[0];
  var option = parseRegular(_.without(arr, alias));

  if(alias){
    option.alias = alias.replace('-','');
  }
  return option;
}

function parseRegular(arr){
  if(!arr[0]){
    return;
  }
  var optionText = arr[0];
  var type = arr[1];
  var option = {};
  option.option = optionText.replace('--', '');
  option.type = type ? type : 'Boolean';

  var helpText = _.without(arr, optionText, type, '');

  var description = helpText.join(' ');
  if(description){
    option.description = description;
  }
  return option;
}

function parseHelp(helpText){
  var helpArr = helpText.split('\n');
  var newArr = [];
  var previousLine =[];
  _.each(helpArr, function(row, index){
    if(index === 0 || index === 1 || index === 2){
      return;
    } else {
      var str = row.replace(',', '');
      var arr = str.trim().split(' ');
      if(str.length > 1 && previousLine[0] !== ''){
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
  var spawn = eslint(['--help'], {help: true}, {});
  spawn.stdout.on('data', function(msg){
    var eslintHelp = msg.toString();
    try {
      cllbk(parseHelp(eslintHelp));
    } catch(e){
      logger.log(e.stack);
    }
  });
};
