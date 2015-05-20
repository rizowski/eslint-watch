'use strict';
var chokidar = require('chokidar');
var eslint = require('eslint');
var success = require('./formatters/helpers/success');

var defaultPath = './';
var jsFileRules = ['*.js$', '**/*.js$'];
var events = {
  change: 'change'
};

var cli = new eslint.CLIEngine();

function watcher(options) {
  var pathToWatch;
  var specifiedPath = options._;
  var formatter = cli.getFormatter();
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

  console.log('Watching', pathToWatch);

  function lintFile(path, config) {
    var results = cli.executeOnFiles([path], config).results;
    console.log(formatter(results));
    printSuccess(results[0]);
  }

  function printSuccess(result) {
    var errorCount = result.errorCount;
    var warningCount = result.warningCount;
    if (errorCount === 0 && warningCount === 0) {
      console.log(success(result));
    }
  }

  watch.on(events.change, function (path) {
    var config = cli.getConfigForFile(path);
    lintFile(path, config);
  });
}

module.exports = watcher;
