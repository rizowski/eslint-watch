'use strict';
var chokidar = require('chokidar');
var eslint = require('eslint');
var chalk = require('chalk');
var _ = require('lodash');

var success = require('./formatters/helpers/success');
var formatter = require('./formatters/simple-detail');
var logger = require('./log')('watcher');
logger.debug('Loaded');

var defaultExtensions = ['.js'];
var events = {
  change: 'change'
};

var cli = new eslint.CLIEngine();
var watch = chokidar.watch()
  .on(events.change, function (path) {
    logger.debug('CHANGED');
    if(!cli.isPathIgnored(path)){
      var config = cli.getConfigForFile(path);
      lintFile(path, config);
    }
  }).on('error', function(err){
    logger.log(err);
  });

/**
 * Given an array of paths and extensions, figure out which paths refer to files.
 * A file is identified by a path ending in ".ext", where ".ext" is one of the extensions that is provided.
 */
function findFilePaths(paths, extensions) {
  var extensionRegex = new RegExp('^.*(' + extensions.join('|') + ')$');

  return _.filter(paths, function (path) {
    return path.search(extensionRegex) > -1;
  });
}

function addGlobToWatcher(path){
  logger.debug('Watching: %s', path);
  watch.add(path);
}

// Add files and paths to the watcher
function watchPaths(filePaths, directoryPaths, extensions) {
  if (filePaths.length > 0) {
    logger.debug('watchPaths (filePaths): %o', filePaths);
    watch.add(filePaths);
  }

  if (directoryPaths.length > 0) {
    logger.debug('WatchPaths (directories): %o', directoryPaths);
    // Remove any trailing slashes from the directory paths for Windows compatibility
    directoryPaths = _.map(directoryPaths, function (directoryPath) {
      return directoryPath.replace(/\/+$/, '');
    });

    // For example:
    // +(directory1|directory2)/**/*+(.ext1|.ext2)
    addGlobToWatcher('+(' + directoryPaths.join('|') + ')/**/*+(' + extensions.join('|') + ')$');
  }
};

function successMessage(result) {
  logger.debug('result: %o', result);
  if (!result.errorCount && !result.warningCount) {
    return success(result) + chalk.grey(' (' + new Date().toLocaleTimeString() + ')');
  }
  return '';
}

function lintFile(path, config) {
  logger.debug('lintFile: %s', path);
  var results = cli.executeOnFiles([path], config).results;
  logger.log(successMessage(results[0]));
  logger.log(formatter(results));
}

function watcher(options) {
  var specifiedPaths;
  var directoryPaths;
  var filePaths;
  var extensions;

  /**
   * If the user has specified extensions, those will be passed in as an array,
   * otherwise, options.ext won't be defined.
   */
  if (options.ext && options.ext.length > 0) {
    extensions = options.ext;
  } else {
    extensions = defaultExtensions;
  }

  /**
   * If the user has specified particular paths, the _ property will contain an array.
   * Otherwise, the _ property will contain "./", the default as a string.
   */
  if (options._ instanceof Array) {
    specifiedPaths = options._;

    /**
     * Files and directories require different glob patterns.
     * Split the up the paths into 2 separate arrays.
     * What is not a file is considered a directory.
     */
    filePaths = findFilePaths(specifiedPaths, extensions);
    directoryPaths = _.difference(specifiedPaths, filePaths);
    watchPaths(filePaths, directoryPaths, extensions);
  } else {
    logger.debug('Watching default path %s', extensions);
    // The default case requires a different glob pattern.
    addGlobToWatcher('**/*+(' + extensions.join('|') + ')$');
  }

  logger.debug('Watching: %o', options._);
}

module.exports = watcher;
