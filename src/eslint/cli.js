'use strict';
var child = require('child_process');
var path = require('path');
var os = require('os');

var cmd = os.platform() === 'win32' ? '.cmd' : '';
var eslint = path.resolve('./node_modules/.bin/eslint' + cmd);

var spawn = child.spawn;

module.exports = function(args, options, childOptions){
  var dirs;
  options = options ? options : {'_': './'};
  var dirs = options._ ? options._ : './';
  childOptions = childOptions ? childOptions : { stdio: 'inherit' };

  if(!options.help){
    console.log('Linting:', dirs);
  }

  return spawn(eslint, args, childOptions);
};
