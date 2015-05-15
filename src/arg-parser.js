'use strict';

module.exports = {
  parse: function (args) {
    var arr = [];
    for (var i = 0; i < args.length; i++) {
      var item = args[i];
      if (item !== '-w' && item !== '--watch') {
        arr.push(item);
      }
    }
    return arr;
  }
};
