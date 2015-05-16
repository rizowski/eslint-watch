'use strict';
var options = require('./options');
var cli = require('./eslint-cli');
var watcher = require('./watcher');
var argParser = require('./arg-parser');

function command() {
  var currentOptions;
  var eslArgs;

  currentOptions = options.parse(process.argv);
  eslArgs = argParser.parse(process.argv, currentOptions);

  if (!currentOptions.help) {
    cli.execute(eslArgs);
    if (currentOptions.watch) {
      watcher(currentOptions._);
    }
  } else {
    console.log(options.generateHelp());
  }
}

command();
