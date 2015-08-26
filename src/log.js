'use strict';

module.exports = {
  log: function(){
    var args = Array.prototype.slice.call(arguments);
    console.log(args.join(' '));
  }
};
