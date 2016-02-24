'use strict';
var child = require('child_process');
var path = require('path');
var os = require('os');
var fs = require('fs');

var logger = require('../log')('eslint-cli');
logger.debug('Loaded');

var cmd = os.platform() === 'win32' ? '.cmd' : '';

var eslint = (function loadEslintPath(){
  var eslintPath;
  try {
    eslintPath = path.resolve('./node_modules/.bin/eslint' + cmd);
    fs.accessSync(eslintPath);
  } catch (e) {
    eslintPath = path.resolve(process.env._, '../eslint' + cmd);
    fs.accessSync(eslintPath);
  }
  return eslintPath;
})();

logger.debug('EsLint path: %s', eslint);
var spawn = child.spawn;

function exitHandle(code){
  logger.debug(code);
}
function errorHandle(err){
  throw err;
}

module.exports = function(args, options, childOptions, exitHandler, errorHandler){
  if(!options){
    options = { _: './' };
  }
  if(options._ && options._.length === 0){
    options._ = './';
  }
  errorHandler = errorHandler || errorHandle;
  exitHandler = exitHandler || exitHandle;

  childOptions = childOptions ? childOptions : { stdio: 'inherit' };
  logger.debug('eslint: %o', args);
  return spawn(eslint, args, childOptions)
    .on('error', errorHandler)// TEMP FIX - AHHHHH No plz. Just until 3.0.0
    .on('exit', exitHandler);
};
