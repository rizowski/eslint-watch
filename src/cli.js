'use strict';
var options = require('./options');
var cli = require('./eslint-cli');
var watcher = require('./watcher');
var argParser = require('./arg-parser');

var currentOptions;
var eslArgs;
var exitCode;

currentOptions = options.parse(process.argv);
eslArgs = argParser.parse(process.argv, currentOptions);

if (!currentOptions.help) {
  exitCode = cli.execute(eslArgs);

  if (currentOptions.watch) {
    watcher(currentOptions);
  }
} else {
  console.log(options.generateHelp());
}

process.on("exit", function () {
  process.exit(exitCode);
});
