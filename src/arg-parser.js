'use strict';

var watch = '--watch';
var w = '-w';
var simple = 'simple';
var simpleSuccess = 'simple-success';
var formatterPath = './src/formatters/';

var defaultPath = './';

module.exports = {
  parse: function (args, options) {
    var arr = [];
    var dirs = options._;
    for (var i = 0; i < args.length; i++) {
      var item = args[i];
      if (item !== w && item !== watch && item !== simple && item !== simpleSuccess) {
        arr.push(item);
      }
      if(item === simple){
        arr.push(formatterPath + item);
      }
      if(item === simpleSuccess){
        arr.push(formatterPath + simpleSuccess);
      }
    }

    if (!dirs.length) {
      arr[arr.length] = defaultPath;
    }

    return arr;
  }
};
