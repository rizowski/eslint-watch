'use strict';
var chokidar = require('chokidar');
var eslint = require('eslint');
var chalk = require('chalk');
var _ = require('lodash');

var success = require('./formatters/helpers/success');
var formatter = require('./formatters/simple-detail');

var defaultPath = './';
var jsFileRules = [];
var events = {
  change: 'change'
};

var cli = new eslint.CLIEngine();

function watcher(options) {
  var specifiedPath = options._;
  var pathToWatch = specifiedPath.length ? specifiedPath : defaultPath;

  _.each(options.ext, function(extension){
    jsFileRules.push('**/*' + extension + '$');
  });

  var watch = chokidar.watch(pathToWatch + jsFileRules);

  console.log('Watching', pathToWatch, '\n');

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

  watch.on(events.change, function (path) {
    if(!cli.isPathIgnored(path)){
      var config = cli.getConfigForFile(path);
      lintFile(path, config);
    }
  });
}

module.exports = watcher;
