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
/*
{
  option: 'help',
  alias: 'h',
  type: 'Boolean',
  description: 'Show help'
}
*/
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
      console.log(createOption(row));
      newArr.push(createOption(row));
    }
  });
  return newArr;
}

module.exports = function(options, parsedOptions){
  var eswHelp = options.generateHelp();
  var spawn = eslint(['--help'], parsedOptions, {});
  spawn.stdout.on('data', function(msg){
    var eslintHelp = msg.toString();
    parseHelp(eslintHelp, eswHelp);
    // console.log();
    // console.log(result);
  });
};
