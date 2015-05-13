'use strict';
var options = require('./options'),
  cli = require('./eslint-cli'),
  watcher = require('./watcher');

var currentOptions;

try {
  currentOptions = options.parse(process.argv);
  if (currentOptions.watch){
    cli.execute('./');
    watcher();
  } else {
    cli.execute(process.argv);
  }
} catch (error) {
  console.log(error);
  return 1;
}
