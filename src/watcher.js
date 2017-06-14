import chokidar from 'chokidar';
import eslint from 'eslint';
import _ from 'lodash';
import path from 'path';

import settings from './settings';
import Logger from './logger';
import clearTerminal from './formatters/helpers/clear-terminal.js';

const logger = Logger('watcher');

logger.debug('Loaded');

const events = { change: 'change' };
const chokidarOptions = {
  ignored: /\.git|node_modules|bower_components/
};
const cliOptionProperties = [
  'config', 'eslintrc', 'ext',
  'parser', 'cache', 'cacheLocation',
  'ignore', 'ignorePath', 'ignorePattern',
  'fix', 'parserOptions', 'global', 'format'
];
const cliOptionMap = {
  config: 'configFile',
  eslintrc: 'useEslintrc',
  ext: 'extensions',
  cacheFile: 'cacheLocation'
};

function filterWarnings(results){
  return _.reduce(results, (curr, result) =>{
    if(result.warningCount){
      let newResult = _.omit(result, 'messages');
      newResult.messages = _.find(result.messages, (m) => m.severity > 1);
      curr.push(newResult);
      return curr;
    }
    curr.push(result);
    return curr;
  }, []);
}

///https://github.com/eslint/eslint/blob/233440e524aa41545b66b2c3c7ca26fe790e32e0/tests/lib/cli-engine.js#L105-L107

export default function watcher(options) {
  let cliOptions = _(options)
    .pick(cliOptionProperties)
    .reduce(function(result, value, key){
      key = cliOptionMap[key] || key;
      result[key] = value;
      return result;
    }, {});
  logger.debug(cliOptions);
  logger.debug(options);
  let cli = new eslint.CLIEngine(cliOptions);


  // replace \ with / for Windows compatibility
  let formatterPath = cliOptions.format.replace(/\\/g, '/');

  // copied from eslint - if the path has a slash, it's a file.
  if (formatterPath.indexOf('/') > -1) {
    const cwd = process.cwd();

    formatterPath = path.resolve(cwd, formatterPath);
  } else {
    formatterPath = `./formatters/${formatterPath}`;
  }

  logger.debug('Trying to load formatter for re-lint from ' + formatterPath);

  let formatter;
  try {
    formatter = require(formatterPath);
  } catch (ex) {
    ex.message = `There was a problem loading formatter: ${formatterPath}\nError: ${ex.message}`;
    // Cannot proceed with re-linting if we don't have a formatter.
    throw ex;
  }

  function lintFile(path) {
    logger.debug('lintFile: %s', path);
    if (options.clear) {
      clearTerminal();
    }
    let report = cli.executeOnFiles(path);
    if (options.fix) {
      eslint.CLIEngine.outputFixes(report);
    }
    const results = settings.cliOptions.quiet ? filterWarnings(report.results) : report.results;
    logger.log(formatter(results));
  }

  function isWatchableExtension(filePath, extensions) {
    logger.debug(filePath, extensions);
    if (extensions) {
      return _.includes(extensions, path.extname(filePath));
    }

    // Use the ESLint default extension, if none is provided
    return _.includes(cli.options.extensions, path.extname(filePath));
  }
  let watchDir = options._.length ? options._ : [path.resolve('./')];

  chokidar.watch(watchDir, chokidarOptions)
    .on(events.change, function changeEvent(path) {
      logger.debug('Changed:', path);
      if (!cli.isPathIgnored(path) && isWatchableExtension(path, options.ext)) {
        const watchPath = options.changed ? [path] : watchDir;
        lintFile(watchPath);
      }
    }).on('error', logger.error);

  logger.debug('Watching: %o', watchDir);
};
