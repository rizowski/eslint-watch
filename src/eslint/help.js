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

function parseHelp(helpText, eswHelp){
  var eswHelpArr = eswHelp.split('\n');
  console.log(eswHelpArr)
  var helpArr = helpText.split('\n');
  var newArr = [];
  var result = _.each(helpArr, function(row, index){
    if(index === 0){
      newArr.push(eswHelpArr[consts.cmd]);
    } else{
      if(contains(row, '--help')){
        newArr.push(eswHelpArr[consts.help]);
      } else if(contains(row, '--format')){
        newArr.push(eswHelpArr[consts.format])
      } else{
        newArr.push(row);
      }
    }

  });
  return newArr;
}

module.exports = function(options, parsedOptions){
  var eswHelp = options.generateHelp();
  var spawn = eslint(['--help'], parsedOptions, {});
  spawn.stdout.on('data', function(msg){
    var eslintHelp = msg.toString();
    console.log(parseHelp(eslintHelp, eswHelp));
    // console.log();
    // console.log(result);
  });
};
