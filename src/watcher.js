'use strict';
var chokidar = require('chokidar');
var eslint = require('eslint');
var chalk = require('chalk');
var _ = require('lodash');

var success = require('./formatters/helpers/success');
var formatter = require('./formatters/simple-detail');
var logger = require('./log')('watcher');

var defaultExtensions = ['.js'];
var events = {
  change: 'change'
};

var cli = new eslint.CLIEngine();

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

// Add files and paths to the watcher
function watchPaths(watch, filePaths, directoryPaths, extensions) {
  if (filePaths.length > 0) {
    watch.add(filePaths);
  }

  if (directoryPaths.length > 0) {
    // Remove any trailing slashes from the directory paths for Windows compatibility
    directoryPaths = _.map(directoryPaths, function (directoryPath) {
       return directoryPath.replace(/\/+$/, '');
    });

    // For example:
    // +(directory1|directory2)/**/*+(.ext1|.ext2)
    watch.add('+(' + directoryPaths.join('|') + ')/**/*+(' + extensions.join('|') + ')$');
  }
};

function watchDefaultPath(watch, extensions) {
  watch.add('**/*+(' + extensions.join('|') + ')$');
}

function successMessage(result) {
  if (result.errorCount === 0 && result.warningCount === 0) {
    return success(result) + chalk.grey(' (' + new Date().toLocaleTimeString() + ')');
  }
  return '';
}

function lintFile(path, config) {
  var results = cli.executeOnFiles([path], config).results;
  logger.log(successMessage(results[0]));
  logger.log(formatter(results));
}

function watcher(options) {
  var specifiedPaths;
  var directoryPaths;
  var filePaths;
  var extensions;
  var watch = chokidar.watch();

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
    watchPaths(watch, filePaths, directoryPaths, extensions);
  } else {
    logger.debug('Watching default path %s', extensions);
    // The default case requires a different glob pattern.
    watchDefaultPath(watch, extensions);
  }

  logger.log('Watching', options._, '\n');

  watch.on(events.change, function (path) {
    if(!cli.isPathIgnored(path)){
      var config = cli.getConfigForFile(path);
      lintFile(path, config);
    }
  });
}

module.exports = watcher;
