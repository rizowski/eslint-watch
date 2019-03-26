import path from 'path';
import unionwith from 'lodash.unionwith';
import optionator from 'optionator';
import kebab from 'lodash.kebabcase';
import { createLogger } from '../logger';

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
    description: 'Regex string of folders to ignore when watching - default: /.git|node_modules|bower_components/',
  },
];

function areEqual(opt1, opt2) {
  if (opt1.heading && opt2.heading) {
    return opt1.heading === opt2.heading;
  }
  return opt1.alias === opt2.alias && opt1.option === opt2.option && opt1.type === opt2.type;
}

export default {
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

        Object.keys(options).forEach(key => {
          if (options[key] instanceof Object)
            options[key] = Object.keys(options[key]).map((optionKey) => `${optionKey}: ${options[key][optionKey]}`).join('');
        });

        if (dirs.length === 0) {
          dirs.push(path.resolve('.'));
        }

        options._ = dirs;

        return options;
      },
    };
  },
  getCli(options) {
    const ignoredKeys = ['watch', 'versions', 'version', 'clear', 'changed', 'watchIgnore'];

    return Object.entries(options).reduce(
      (acc, [key, value]) => {
        if (ignoredKeys.includes(key)) {
          return acc;
        }

        if (key === '_') {
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
