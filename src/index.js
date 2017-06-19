/* eslint no-process-exit: 0*/
import keypress from 'keypress';

import settings from './settings';
import eslintCli from './eslint/cli';
import parseOptions from './options';
import watcher from './watcher';
import argParser from './arg-parser';
import Logger from './logger';
import pkg from '../package';
import clearTerminal from './formatters/helpers/clear-terminal.js';

const logger = Logger('esw-cli');

logger.debug('Loaded');
logger.debug(`Eslint-Watch: ${pkg.version}`);

const state = {
  exitCode: 0,
  running: false
};
const args = process.argv;

function logLint(result) {
  logger.debug('lint completed. Exit Code: %o', result.exitCode);
  state.exitCode = result.exitCode;
  state.running = false;
  logger.log(result.message);
}

function keyListener(args, options){
  let stdin = process.stdin;
  if(!stdin.setRawMode){
    logger.debug('Process might be wrapped exiting keybinding');
    return;
  }
  keypress(stdin);
  stdin.on('keypress', function keyPressListener(ch, key){
    logger.debug('%s was pressed', key ? key.name : ch);
    if(key && key.name === 'return' && !state.running){
      logger.debug('relinting...');
      logger.debug(options);
      state.running = true;
      eslintCli(args, options, logLint);
    }
    if(key && key.ctrl && key.name === 'c') {
      process.exit();
    }
  });
  stdin.setRawMode(true);
  stdin.resume();
}

logger.debug('Arguments passed: %o', args);
parseOptions(args, setupParsedOptions);

function setupParsedOptions(parsedOptions) {
  settings.cliOptions = parsedOptions;
  if(parsedOptions.eswVersion){
    logger.log(pkg.version);
  } else {
    logger.debug('Parsing args');
    const eslArgs = argParser.parse(args, parsedOptions);
    if (!parsedOptions.help) {
      logger.debug('Running initial lint');
      if (parsedOptions.clear) {
        clearTerminal();
      }
      eslintCli(eslArgs, parsedOptions, logLint);
      state.running = true;
      if (parsedOptions.watch) {
        logger.debug('-w seen');
        keyListener(eslArgs, parsedOptions);
        watcher(parsedOptions);
      }
    } else {
      logger.log(helpOptions.generateHelp());
    }
  }
}


process.on('exit', () => {
  logger.debug(`Exiting: ${state.exitCode}`);
  process.exit(exitCode);
});
