/* eslint no-process-exit: 0*/
'use strict';

var eslint = require('./eslint');
var getOptions = require('./options');
var watcher = require('./watcher');
var argParser = require('./arg-parser');

var eslintCli = eslint.cli;

var parsedOptions;
var eslArgs;
var exitCode;

getOptions(function(options){
  var args = process.argv;

  parsedOptions = options.parse(args);
  eslArgs = argParser.parse(args, parsedOptions);

  if (!parsedOptions.help) {
    var child = eslintCli(eslArgs, parsedOptions);

    child.on('exit', function(code){
      exitCode = code;
    });

    if (parsedOptions.watch) {
      watcher(parsedOptions);
    }
  } else {
    console.log(options.generateHelp());
  }
});


process.on('exit', function () {
  process.exit(exitCode);
});
