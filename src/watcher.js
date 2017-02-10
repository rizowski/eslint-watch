import chokidar from 'chokidar';
import eslint from 'eslint';
import _ from 'lodash';
import path from 'path';

import formatter from './formatters/simple-detail';
import Logger from './log';

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
  'fix', 'parserOptions', 'global'
];
const cliOptionMap = {
  config: 'configFile',
  eslintrc: 'useEslintrc',
  ext: 'extensions',
  cacheFile: 'cacheLocation'
};

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

  function lintFile(path) {
    logger.debug('lintFile: %s', path);
    let report = cli.executeOnFiles(path);
    if (options.fix) {
      eslint.CLIEngine.outputFixes(report);
    }

    let results = report.results;
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
