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
  var option;
  if(result){
    option = parseRegular(arr);
  } else {
    option = parseAlias(arr);
  }
  return option;
}

function parseAlias(arr){
  var option = parseRegular(_.without(arr, arr[0]));
  option.alias = arr[0];
  return option;
}

function parseRegular(arr){
  var option = {};
  option.option = arr[0];
  option.type = arr[1];
  var helpText = _.without(arr, arr[0], arr[1], '');

  option.description = helpText.join(' ');

  return option;
}

function parseHelp(helpText){
  var helpArr = helpText.split('\n');
  var newArr = [];
  var result = _.each(helpArr, function(row, index){
    if(index === 0 || index === 1 || index === 2){
      return;
    } else {
      newArr.push(createOption(row));
    }
  });
  return newArr;
}

// rewrite in es6 this callback yucky stuff goes away.
module.exports = function(options, cllbk){
  var spawn = eslint(['--help'], {}, {});
  spawn.stdout.on('data', function(msg){
    var eslintHelp = msg.toString();
    cllbk(parseHelp(eslintHelp));
  });
};
