'use strict';
var options = require('./options'),
  cli = require('./eslint-cli'),
  watcher = require('./watcher'),
  parser = require('./arg-parser');
function command() {
  var currentOptions;
  var args;

  currentOptions = options.parse(process.argv);

  args = parser.parse(process.argv);

  cli.execute(args);
  if (currentOptions.watch) {
    watcher();
  }
}

command();

