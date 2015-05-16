'use strict';
var chokidar = require('chokidar');
var chalk = require('chalk');
var eslint = require('eslint');

var defaultPath = './';
var jsFileRules = ['*.js$', '**/*.js$'];
var events = {
  change: 'change'
};

function watcher(specifiedPath) {
  var cli = new eslint.CLIEngine();
  var formatter = cli.getFormatter();

  var watch = chokidar.watch(specifiedPath);

  if (specifiedPath.length) {
    watch.unwatch(defaultPath);
    watch.add(specifiedPath);
    watch.add(jsFileRules[0]);
    console.log('Watching', specifiedPath);
  }
  else {
    watch.add(jsFileRules);
    console.log('Watching', defaultPath);
  }

  function lintFile(path, config) {
    var results = cli.executeOnFiles([path], config).results;
    printSuccess(path, results);
    console.log(formatter(results));
  }

  function printSuccess(path, results) {
    var errorCount = results[0].errorCount;
    if (errorCount === 0) {
      console.log(chalk.underline(path), ' ', chalk.green('Woo! No Errors or warnings!'));
    }
  }

  watch.on(events.change, function (path) {
    var config = cli.getConfigForFile(path);
    lintFile(path, config);
  });
}

module.exports = watcher;
