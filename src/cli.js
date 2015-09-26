/* eslint no-process-exit: 0*/
'use strict';

var keypress = require('keypress');

var eslint = require('./eslint');
var getOptions = require('./options');
var watcher = require('./watcher');
var argParser = require('./arg-parser');
var logger = require('./log')('esw-cli');

var eslintCli = eslint.cli;

var parsedOptions;
var eslArgs;
var exitCode;

keypress(process.stdin);

var args = process.argv;

function runLint(args, options){
  var child = eslintCli(args, options);

  child.on('exit', function(code){
    logger.debug('Exiting setting exit code to: %s', code);
    exitCode = code;
  });
  return child;
}

function keyListener(args, options){
  var stdin = process.stdin;
  if(!stdin.setRawMode){
    logger.debug('Process might be wrapped exitig keybinding');
    return;
  }
  stdin.on('keypress', function(ch, key){
    logger.debug('%s was pressed', key.name);
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
  logger.debug('Arguments passed: %s', args);
  parsedOptions = options.parse(args);
  logger.debug('Parsing args');
  eslArgs = argParser.parse(args, parsedOptions);

  if (!parsedOptions.help) {
    logger.debug('Running initial lint');
    runLint(eslArgs, parsedOptions);
    if (parsedOptions.watch) {
      logger.debug('-w seen');
      keyListener(eslArgs, parsedOptions);
      watcher(parsedOptions);
    }
  } else {
    logger.log(options.generateHelp());
  }
});

process.on('exit', function () {
  process.exit(exitCode);
});
