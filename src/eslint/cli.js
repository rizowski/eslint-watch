'use strict';
var child = require('child_process');
var path = require('path');
var os = require('os');
var fs = require('fs');
var _ = require('lodash');

var logger = require('../log')('eslint-cli');
logger.debug('Loaded');

var windows = os.platform() === 'win32';

var cmd = windows ? '.cmd' : '';

var eslintPath = (function loadEslintPath(){
  var eslintPath;
  try {
    eslintPath = path.join('./', 'node_modules/.bin/eslint' + cmd);
    fs.accessSync(eslintPath);
  } catch (e) {
    eslintPath = path.join(process.env._, '../eslint' + cmd);
    fs.accessSync(eslintPath);
  }
  return eslintPath;
})();

logger.debug('EsLint path: %s', eslintPath);
var spawn = child.spawn;

function exitHandle(code){
  logger.debug(code);
}
function errorHandle(err){
  throw err;
}

module.exports = function(args, options, childOptions, exitHandler, errorHandler){
  errorHandler = errorHandler || errorHandle;
  exitHandler = exitHandler || exitHandle;
  childOptions = _.merge({}, childOptions, { env: process.env });
  // console.log(options);
  args = _.union([eslintPath], args);

  logger.debug('eslint: %o', args);
  var eslint = spawn(eslintPath, args, childOptions);
  eslint.on('error', errorHandler);
  eslint.stderr.on('error', errorHandler);
  eslint.on('exit', exitHandler);
  return eslint;
    // .on('error', errorHandler)// TEMP FIX - AHHHHH No plz. Just until 3.0.0
    // .on('exit', exitHandler);
};
