/* eslint no-process-exit: 0*/
import keypress from 'keypress';
import 'source-map-support/register';

import { cli as eslintCli } from './eslint';
import getOptions from './options';
import watcher from './watcher';
import argParser from './arg-parser';
import Logger from './log';

let logger = Logger('esw-cli');
logger.debug('loaded');

let parsedOptions;
let eslArgs;
let exitCode;

function runLint(args, options){
  logger.debug(args);
  let child = eslintCli(args, options);

  child.on('exit', code => {
    logger.debug('Setting exit code to: %s', code);
    exitCode = code;
  });
  return child;
}

function keyListener(args, options){
  let stdin = process.stdin;
  if(!stdin.setRawMode){
    logger.debug('Process might be wrapped exitig keybinding');
    return;
  }
  keypress(stdin);
  stdin.on('keypress', (ch, key) => {
    logger.debug('%s was pressed', key.name);
    if(key.name === 'return'){
      logger.debug('Rerunning lint...');
      runLint(args, options);
    }
    if(key.ctrl && key.name === 'c') {
      process.exit();
    }
  });
  stdin.setRawMode(true);
  stdin.resume();
}

getOptions()
  .then(options => {
    let args = process.argv;
    logger.debug('Arguments passed: %o', args);
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
  }).catch(err => {
    logger.error(err);
  });

process.on('exit', () => {
  process.exit(exitCode);
});
