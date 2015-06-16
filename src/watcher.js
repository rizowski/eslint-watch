'use strict';
var chokidar = require('chokidar');
var eslint = require('eslint');
var chalk = require('chalk');
var success = require('./formatters/helpers/success');
var formatter = require('./formatters/simple-detail');

var defaultPath = './';
var jsFileRules = ['*.js$', '**/*.js$'];
var events = {
  change: 'change'
};

var cli = new eslint.CLIEngine();

function watcher(options) {
  var pathToWatch;
  var specifiedPath = options._;
  var watch = chokidar.watch(specifiedPath);

  if (specifiedPath.length) {
    watch.unwatch(defaultPath);
    watch.add(specifiedPath);
    watch.add(jsFileRules[0]);
    pathToWatch = specifiedPath;
  } else {
    watch.add(jsFileRules);
    pathToWatch = defaultPath;
  }

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
