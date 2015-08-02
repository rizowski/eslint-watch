/* eslint no-process-exit: 0*/
'use strict';
var options = require('./options');
var eslint = require('./eslint-cli');
var watcher = require('./watcher');
var argParser = require('./arg-parser');
var helper = require('./help-generator');

var parsedOptions;
var eslArgs;
var exitCode;

var args = process.argv;

parsedOptions = options.parse(args);
eslArgs = argParser.parse(args, parsedOptions);

if (!parsedOptions.help) {
  exitCode = eslint(eslArgs, parsedOptions).status;

  if (parsedOptions.watch) {
    watcher(parsedOptions);
  }
} else {
  helper(options, parsedOptions);
}

process.on('exit', function () {
  process.exit(exitCode);
});
