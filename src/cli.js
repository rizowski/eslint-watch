'use strict';
var options = require('./options'),
  cli = require('./eslint-cli'),
  watcher = require('./watcher'),
  argParser = require('./arg-parser');

function command() {
  var currentOptions;
  var eslArgs;

  currentOptions = options.parse(process.argv);
  eslArgs = argParser.parse(process.argv, currentOptions);

  cli.execute(eslArgs);

  if (currentOptions.watch) {
    watcher(currentOptions._);
  }
}

command();

