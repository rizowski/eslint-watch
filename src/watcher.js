'use strict';
var chokidar = require('chokidar');
var eslint = require('eslint');
var chalk = require('chalk');
var _ = require('lodash');

var success = require('./formatters/helpers/success');
var formatter = require('./formatters/simple-detail');

// Use an empty string instead of "./" for glob pattern purposes
var defaultPaths = [''];
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

  // For example:
  // +(directory1|directory2)**/*+(.ext1|.ext2)
  if (directoryPaths.length > 0) {
    watch.add('+(' + directoryPaths.join('|') + ')**/*+(' + extensions.join('|') + ')$');
  }
};

function successMessage(result) {
  if (result.errorCount === 0 && result.warningCount === 0) {
    return success(result) + chalk.grey(' (' + new Date().toLocaleTimeString() + ')');
  }
  return '';
}

function lintFile(path, config) {
  var results = cli.executeOnFiles([path], config).results;
  console.log(successMessage(results[0]));
  console.log(formatter(results));
}

function watcher(options) {
  var specifiedPaths;
  var directoryPaths;
  var filePaths;
  var extensions;

  /**
   * If the user has specified particular paths, the _ property will contain an array.
   * Otherwise, the _ property will contain "./", the default as a string.
   * In the default case, use an array instead.
   */
  if (options._ instanceof Array) {
    specifiedPaths = options._;
  } else {
    specifiedPaths = defaultPaths;
  }

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
   * Files and directories require different glob patterns.
   * Split the up the paths into 2 separate arrays.
   * What is not a file is considered a directory.
   */
  filePaths = findFilePaths(specifiedPaths, extensions);
  directoryPaths = _.difference(specifiedPaths, filePaths);

  var watch = chokidar.watch();
  watchPaths(watch, filePaths, directoryPaths, extensions);

  console.log('Watching', options._, '\n');

  watch.on(events.change, function (path) {
    if(!cli.isPathIgnored(path)){
      var config = cli.getConfigForFile(path);
      lintFile(path, config);
    }
  });
}

module.exports = watcher;
