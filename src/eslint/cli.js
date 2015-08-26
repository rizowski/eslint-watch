'use strict';
var child = require('child_process');
var path = require('path');
var os = require('os');

var logger = require('../log');

var cmd = os.platform() === 'win32' ? '.cmd' : '';
var eslint = path.resolve('./node_modules/.bin/eslint' + cmd);

var spawn = child.spawn;

module.exports = function(args, options, childOptions){
  if(!options){
    options = { _: './'};
  }
  if(options._ && options._.length === 0){
    options._ = './';
  }
  childOptions = childOptions ? childOptions : { stdio: 'inherit' };

  if(!options.help){
    logger.log('Linting:', options._);
  }

  return spawn(eslint, args, childOptions);
};
