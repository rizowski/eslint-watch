'use strict';
var child = require('child-process-promise');
var path = require('path');
var os = require('os');
var cmd = os.platform() === 'win32' ? '.cmd' : '';
var eslint = path.resolve('./node_modules/.bin/eslint' + cmd);

var exec = child.spawn;

module.exports = function(args){
  return exec(eslint, args, { stdio: 'inherit' })
    .catch(function(){
      //console.log(err);
      // process.exit(1);
    });
};
