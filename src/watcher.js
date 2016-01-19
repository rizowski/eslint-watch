import chokidar from 'chokidar';
import { CLIEngine } from 'eslint';
import chalk from 'chalk';
import _ from 'lodash';
import path from 'path';

import success from './formatters/helpers/success';
import formatter from './formatters/simple-detail';
import Logger from './log';

let logger = Logger('watcher');
logger.debug('Loaded');

let events = {
  change: 'change'
};
let chokidarOptions = {
  ignored: /\.git|node_modules|bower_components/
};

let cli = new CLIEngine();

function successMessage(result) {
  logger.debug('result: %o', result);
  if (!result.errorCount && !result.warningCount) {
    return success(result) + chalk.grey(' (' + new Date().toLocaleTimeString() + ')');
  }
  return '';
}

function lintFile(path, config) {
  logger.debug('lintFile: %s', path);
  let results = cli.executeOnFiles([path], config).results;
  logger.log(successMessage(results[0]));
  logger.log(formatter(results));
}

function isWatchableExtension(filePath){
  return _.contains(cli.options.extensions, path.extname(filePath));
}

export default function watcher(options) {
  chokidar.watch(options._, chokidarOptions)
    .on(events.change, path => {
      logger.debug('Changed:', path);
      if(!cli.isPathIgnored(path) && isWatchableExtension(path)){
        let config = cli.getConfigForFile(path);
        lintFile(path, config);
      }
    }).on('error', err => {
      logger.error(err);
    });

  logger.debug('Watching: %o', options._);
};
