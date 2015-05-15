'use strict';
var chokidar = require('chokidar'),
  chalk = require('chalk'),
  eslint = require('eslint');

var defaultPath = './';
var jsFileRules = ['*.js$', '**/*.js$'];

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
      var message = chalk.underline(path) + ' ';
      message += chalk.green('Woo! No Errors or warnings!');
      console.log(message);
    }
  }

  watch.on('change', function (path) {
    var config = cli.getConfigForFile(path);
    lintFile(path, config);
  });
}

module.exports = watcher;
