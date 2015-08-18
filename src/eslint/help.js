'use strict';

var eslint = require('./cli');
var _ = require('lodash');

var contains = function(str, item){
  return str.indexOf(item) >= 0;
};
var consts = {
  cmd: 0,
  help: 3,
  format: 4,
  watch: 5
}

function createOption(str){
  var arr = str.trim().split(' ');
  var result = arr[0].match(/--\w/);
  var option = result ? parseRegular(arr) : parseAlias(arr);
  var isEmpty = _.isEmpty(option);
  return isEmpty ? undefined : option;
}

function parseAlias(arr){
  var alias = arr[0];
  var option = parseRegular(_.without(arr, alias));

  if(alias){
    option.alias = alias;
  }
  return option;
}

function parseRegular(arr){
  var optionText = arr[0];
  var type = arr[1];
  var option = {};
  if(optionText){
    option.option = optionText;
  }
  if(type){
    option.type = type;
  }
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
  var result = _.each(helpArr, function(row, index){
    if(index === 0 || index === 1 || index === 2){
      return;
    } else {
      var option = createOption(row);
      if(option){
        newArr.push(option);
      }
    }
  });
  return newArr;
}

// rewrite in es6 this callback yucky stuff goes away.
module.exports = function(cllbk){
  var spawn = eslint(['--help'], {}, {});
  spawn.stdout.on('data', function(msg){
    var eslintHelp = msg.toString();
    cllbk(parseHelp(eslintHelp));
  });
};