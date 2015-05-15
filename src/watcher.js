'use strict';
var chokidar = require('chokidar'),
  chalk = require('chalk'),
  eslint = require('eslint');

function watcher(){
  var cli = new eslint.CLIEngine(),
    formatter = cli.getFormatter();

  console.log('Watching');

  var watch = chokidar.watch('file, dir');
  watch.add(['*.js$', '**/*.js$']);

  function lintFile(path, config){
    var results = cli.executeOnFiles([path], config).results;
    var errorCount = results[0].errorCount;
    if (errorCount === 0) {
      var message = chalk.underline(path) + ' ';
      message += chalk.green('Woo! No Errors or warnings!');
      console.log(message);
    }
    console.log(formatter(results));
  }

  watch.on('change', function(path){
    var config = cli.getConfigForFile(path);
    lintFile(path, config);
  });
}

module.exports = watcher;
