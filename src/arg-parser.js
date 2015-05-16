'use strict';

var watch = '--watch';
var w = '-w';
var defaultPath = './';

module.exports = {
  parse: function (args, options) {
    var arr = [];
    var dirs = options._;

    for (var i = 0; i < args.length; i++) {
      var item = args[i];
      if (item !== w && item !== watch) {
        arr.push(item);
      }
    }

    if (!dirs.length) {
      arr[arr.length] = defaultPath;
    }

    return arr;
  }
};
