/* eslint no-process-exit: 0*/
'use strict';
var options = require('./options');
var eslint = require('./eslint-cli');
var watcher = require('./watcher');
var argParser = require('./arg-parser');

var currentOptions;
var eslArgs;
var exitCode;

var args = process.argv;

currentOptions = options.parse(args);
eslArgs = argParser.parse(args, currentOptions);

if (!currentOptions.help) {
  eslint(eslArgs)
    .catch(function(err){
      if(err.code){
        exitCode = err.code;
      }
    });

  if (currentOptions.watch) {
    watcher(currentOptions);
  }
} else {
  console.log(options.generateHelp());
}

process.on('exit', function () {
  process.exit(exitCode);
});
