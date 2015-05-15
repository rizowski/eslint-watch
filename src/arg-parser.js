'use strict';

var watch = '--watch';
var w = '-w';

module.exports = {
  parse: function (args, options) {
    var arr = [];
    var arrLength;
    var dirs = options._;

    for (var i = 0; i < args.length; i++) {
      var item = args[i];
      if (item !== w && item !== watch) {
        arr.push(item);
      }
    }
    arrLength = arr.length;

    if (!dirs.length) {
      arr[arrLength] = './';
    }

    return arr;
  }
};
