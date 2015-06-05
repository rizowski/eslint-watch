'use strict';
var path = require('path');

var simpleDetail = 'simple-detail';
var formatterPath = 'formatters';

var defaultPath = './';
var formatKey = '-f';
var keys = {
  '-w': true,
  '--watch': true
};
var formats = { // still don't like this can cause too much duplication
  'simple': true,
  'simple-success': true,
  'simple-detail': true
};
var getPath = function(options){
  return path.join(__dirname, formatterPath, options.format);
};

module.exports = {
  parse: function (args, options) {
    var arr = [];
    var dirs = options._;
    var formatSpecified = false;

    for (var i = 0; i < args.length; i++) {
      var item = args[i];
      if (!keys[item] && !formats[item]) {
        arr.push(item);
      }
      if (formats[item]) {
        formatSpecified = true;
        arr.push(getPath(options));
      }
    }
    if (options.format === simpleDetail && !formatSpecified) {
      arr.push(formatKey);
      arr.push(getPath(options));
    }
    if (!dirs.length) {
      arr[arr.length] = defaultPath;
    }
    return arr;
  }
};
