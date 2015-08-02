'use strict';
var child = require('child_process');
var path = require('path');
var os = require('os');

var cmd = os.platform() === 'win32' ? '.cmd' : '';
var eslint = path.resolve('./node_modules/.bin/eslint' + cmd);
var spawn = child.spawnSync;

module.exports = function(args, options){
  var dirs = options._.length ? options._ : './';
  console.log('Linting', dirs);

  return spawn(eslint, args, { stdio: 'inherit' });
};
