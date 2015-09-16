'use strict';
var debug = require('debug');

module.exports = function(thing){
  return {
    log: function(){
      var args = Array.prototype.slice.call(arguments);
      console.log(args.join(' '));
    },
    debug: debug('esw:' + thing)
  };
};
