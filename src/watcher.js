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
  ignored: /\.git|node_modules|bower_components/,
};
const cliOptionProperties = [
  'config',
  'eslintrc',
  'ext',
  'parser',
  'cache',
  'cacheLocation',
  'ignore',
  'ignorePath',
  'ignorePattern',
  'fix',
  'parserOptions',
  'global',
];
const cliOptionMap = {
  config: 'configFile',
  eslintrc: 'useEslintrc',
  ext: 'extensions',
  cacheFile: 'cacheLocation',
};

function filterWarnings(results) {
  return _.reduce(
    results,
    (curr, result) => {
      if (result.warningCount) {
        let newResult = _.omit(result, 'messages');
        newResult.messages = _.filter(result.messages, (m) => m.severity > 1);
        curr.push(newResult);
        return curr;
      }
      curr.push(result);
      return curr;
    },
    []
  );
}

function requireFormatter(formatterPath) {
  try {
    return require(formatterPath);
  } catch (ex) {
    ex.message = `There was a problem loading formatter: ${formatterPath}\nError: ${ex.message}`;
    throw ex;
  }
}

function getFormatter(cli, formatter) {
  const pathToFormatterSpecified = formatter.includes('\\');
  const isSimpleFormatter = formatter.includes('simple');
  const formatterPath = formatter.replace(/\\/g, '/');

  if (isSimpleFormatter) {
    logger.debug(`Formatter local: ${formatter}`);

    return requireFormatter(`./formatters/${formatterPath}`);
  } else if (pathToFormatterSpecified) {
    const cwd = process.cwd();

    logger.debug('Formatter user:', formatterPath);
    const location = path.resolve(cwd, formatterPath);

    return requireFormatter(location);
  }

  logger.debug(`Formatter eslint: ${formatter}`);

  return cli.getFormatter(formatter);
}

///https://github.com/eslint/eslint/blob/233440e524aa41545b66b2c3c7ca26fe790e32e0/tests/lib/cli-engine.js#L105-L107

export default function watcher(options) {
  const cliOptions = _(options)
    .pick(cliOptionProperties)
    .reduce(function(result, value, key) {
      key = cliOptionMap[key] || key;
      result[key] = value;
      return result;
    }, {});
  logger.debug('cli', cliOptions);
  logger.debug('options', options);
  const cli = new eslint.CLIEngine(cliOptions);
  const watchDir = options._.length ? options._ : [path.resolve('./')];

  const formatter = getFormatter(cli, options.format);

  function lintFile(path) {
    logger.debug('lintFile: %s', path);
    if (options.clear) {
      clearTerminal();
    }
    const report = cli.executeOnFiles(path);
    if (options.fix) {
      eslint.CLIEngine.outputFixes(report);
    }
    const results = settings.cliOptions.quiet ? filterWarnings(report.results) : report.results;

    logger.log(formatter(results));
  }

  function isWatchableExtension(filePath, extensions = cli.options.extensions) {
    const extension = path.extname(filePath);
    const dotExtensions = extensions.map((e) => {
      if (!e.match(/^\./)) {
        return `.${e}`;
      }
      return e;
    });

    logger.debug(extension, dotExtensions);
    if (dotExtensions.length > 0) {
      return _.includes(dotExtensions, extension);
    }

    // Use the ESLint default extension, if none is provided
    return _.includes(cli.options.extensions, extension);
  }

  chokidar
    .watch(watchDir, chokidarOptions)
    .on(events.change, function changeEvent(path) {
      logger.debug('Changed:', path);
      if (!cli.isPathIgnored(path) && isWatchableExtension(path, options.ext)) {
        const watchPath = options.changed ? [path] : watchDir;

        lintFile(watchPath);
      }
    })
    .on('error', logger.error);

  logger.debug('Watching: %o', watchDir);
}
