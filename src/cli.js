/* eslint no-process-exit: 0*/
'use strict';

var eslint = require('./eslint');
var options = require('./options');
var watcher = require('./watcher');
var argParser = require('./arg-parser');

var eslintCli = eslint.cli;
var helper = eslint.help;

var parsedOptions;
var eslArgs;
var exitCode;

var args = process.argv;

parsedOptions = options.parse(args);
eslArgs = argParser.parse(args, parsedOptions);

if (!parsedOptions.help) {
  exitCode = eslintCli(eslArgs, parsedOptions).status;

  if (parsedOptions.watch) {
    watcher(parsedOptions);
  }
} else {
  helper(options, parsedOptions);
}

process.on('exit', function () {
  process.exit(exitCode);
});
