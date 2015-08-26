/* eslint no-process-exit: 0*/
'use strict';

var keypress = require('keypress');

var eslint = require('./eslint');
var getOptions = require('./options');
var watcher = require('./watcher');
var argParser = require('./arg-parser');

var eslintCli = eslint.cli;

var parsedOptions;
var eslArgs;
var exitCode;

keypress(process.stdin);

var args = process.argv;

function runLint(args, options){
  var child = eslintCli(args, options);

  child.on('exit', function(code){
    exitCode = code;
  });
  return child;
}

function keyListener(args, options){
  var stdin = process.stdin;
  stdin.on('keypress', function(ch, key){
    if(key.name === 'return'){
      runLint(args, options);
    }
    if(key.ctrl && key.name === 'c') {
      process.exit();
    }
  });
  stdin.setRawMode(true);
  stdin.resume();
}

getOptions(function(options){
  parsedOptions = options.parse(args);
  eslArgs = argParser.parse(args, parsedOptions);

  if (!parsedOptions.help) {
    runLint(eslArgs, parsedOptions);

    if (parsedOptions.watch) {
      keyListener(eslArgs, parsedOptions);
      watcher(parsedOptions);

    }
  } else {
    console.log(options.generateHelp());
  }
});


process.on('exit', function () {
  process.exit(exitCode);
});
