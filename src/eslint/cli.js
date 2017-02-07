import _ from 'lodash';
var path = require('path');
var os = require('os');
var fs = require('fs');
var exec = require('../executor');

var logger = require('../log')('eslint-cli');
logger.debug('Loaded');

var windows = os.platform() === 'win32';

var cmd = windows ? '.cmd' : '';

const eslintPath = (function loadEslintPath(){
  let eslintPath;
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
var spawn = exec.spawnSync;

/**
  This needs to be changed so you execute eslint in this fashion
  var result = eslint(eslintArgs..., childOptions);
*/

module.exports = function(args, options){
  logger.debug('eslint: %o', args);
  var result = spawn(eslintPath, args, _.merge({ stdio: 'inherit' }, options));
  if(result.error){
    throw Error(result.stderr.toString());
  }
  return result.output.toString();
};
