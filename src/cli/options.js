const path = require('path');
const unionwith = require('lodash.unionwith');
const optionator = require('optionator');
const kebab = require('lodash.kebabcase');
const { createLogger } = require('../logger');

const logger = createLogger('options');

const settings = {
  prepend: 'esw [options] [file.js ...] [dir ...]',
  concatRepeatedArrays: true,
  mergeRepeatedObjects: true,
};

const defaultOptions = [
  {
    heading: 'ESW Options',
  },
  {
    option: 'help',
    alias: 'h',
    type: 'Boolean',
    description: 'Show help',
  },
  {
    option: 'watch',
    alias: 'w',
    type: 'Boolean',
    description: 'Enable file watch',
  },
  {
    option: 'changed',
    type: 'Boolean',
    description: 'Enables single file linting while watch is enabled',
  },
  {
    option: 'clear',
    type: 'Boolean',
    description: 'Clear terminal when running lint',
  },
  {
    option: 'version',
    type: 'Boolean',
    alias: 'v',
    description: 'Prints Eslint-Watch Version',
  },
  {
    option: 'versions',
    type: 'Boolean',
    description: 'Prints Eslint-Watch and Eslint Versions',
  },
  {
    option: 'watch-ignore',
    type: 'RegExp',
    description: 'Regex string of folders to ignore when watching - default: /.git|node_modules|bower_components|.eslintcache/',
  },
  {
    option: 'watch-delay',
    type: 'Int',
    description: 'Delay(ms) for watcher to wait to trigger re-lint',
    default: '300',
  },
  {
    heading: 'Basic configuration',
  },
  {
    option: 'ext',
    type: '[String]',
    description: 'Specify JavaScript file extensions',
    default: '.js',
  },
];

function areEqual(opt1, opt2) {
  if (opt1.heading && opt2.heading) {
    return opt1.heading === opt2.heading;
  }

  return opt1.alias === opt2.alias && opt1.option === opt2.option && opt1.type === opt2.type;
}

module.exports = {
  get eswOptions() {
    return [...defaultOptions];
  },
  createOptions(eswOptions, eslintOptions = []) {
    const mergedOptions = unionwith(eswOptions, eslintOptions, areEqual);
    logger.debug(mergedOptions);
    const opsor = optionator({ ...settings, options: mergedOptions });

    return {
      helpText: opsor.generateHelp(),
      parse(rawArgs) {
        const options = opsor.parse(rawArgs, { slice: 0 });
        const dirs = options._;

        if (dirs.length === 0) {
          dirs.push(path.resolve('.'));
        }

        options._ = dirs;

        return options;
      },
    };
  },
  getCli(options) {
    const eswKeys = ['watch', 'versions', 'version', 'clear', 'changed', 'watchIgnore', 'watchDelay'];

    return Object.entries(options).reduce(
      (acc, [key, value]) => {
        if (eswKeys.includes(key)) {
          return acc;
        }

        if (key === '_') {
          return acc;
        }

        if (key === 'rule') {
          Object.keys(value).forEach((ruleKey) => {
            acc.flags.push('--rule', `${ruleKey}: ${JSON.stringify(value[ruleKey]).replace(/"/g, '')}`);
          });

          return acc;
        }

        if (typeof value === 'boolean') {
          acc.flags.push(`--${value ? '' : 'no-'}${kebab(key)}`);
        } else {
          acc.flags.push(`--${kebab(key)}`);
          acc.flags.push(value);
        }

        return acc;
      },
      {
        flags: [],
        dirs: options._ || [],
      }
    );
  },
};
