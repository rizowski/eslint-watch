'use strict';
var path = require('path');

var simple = 'simple';
var simpleSuccess = 'simple-success';
var simpleDetail = 'simple-detail';
var formatterPath = 'formatters';

var defaultPath = './';
var rejected = { // todo: need to fix this
  '-w': true,
  '--watch': true,
  'simple': true,
  'simple-success': true,
  'simple-detail': true
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
      if (item === simple || item === simpleSuccess || item === simpleDetail) {
        arr.push(path.join(__dirname, formatterPath, options.format));
      }
    }
    if (!dirs.length) {
      arr[arr.length] = defaultPath;
    }

    return arr;
  }
};
