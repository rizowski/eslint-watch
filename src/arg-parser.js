'use strict';

var simple = 'simple';
var simpleSuccess = 'simple-success';
var formatterPath = './src/formatters/';

var defaultPath = './';
var rejected = {
  '-w': true,
  '--watch': true,
  'simple': true,
  'simple-success': true
};

module.exports = {
  parse: function (args, options) {
    var arr = [];
    var dirs = options._;
    for (var i = 0; i < args.length; i++) {
      var item = args[i];
      if (!rejected[item]) {
        arr.push(item);
      }
      if (item === simple || item === simpleSuccess) {
        arr.push(formatterPath + options.format);
      }
    }
    if (!dirs.length) {
      arr[arr.length] = defaultPath;
    }

    return arr;
  }
};
