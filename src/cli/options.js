import path from 'path';
import unionwith from 'lodash.unionwith';
import optionator from 'optionator';
import kebab from 'lodash.kebabcase';

const settings = {
  prepend: 'esw [options] [file.js ...] [dir ...]',
  concatRepeatedArrays: true,
  mergeRepeatedObjects: true,
};

const defaultOptions = [
  {
    heading: 'Options',
  },
  {
    option: 'help',
    alias: 'h',
    type: 'Boolean',
    description: 'Show help',
  },
  {
    heading: 'ESW Options',
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
];

function areEqual(opt1, opt2) {
  if (opt1.heading && opt2.heading) {
    return opt1.heading === opt2.heading;
  }
  return opt1.alias === opt2.alias && opt1.option === opt2.option && opt1.type === opt2.type;
}

export default {
  getOptions() {
    return [...defaultOptions];
  },
  createOptions(eswOptions, eslintOptions) {
    const mergedOptions = unionwith(eswOptions, eslintOptions, areEqual);
    const opsor = optionator({ ...settings, options: mergedOptions });

    return {
      helpText: opsor.generateHelp(),
      parse(rawArgs) {
        const options = opsor.parse(rawArgs);

        if (options._.length === 0) {
          options._ = [path.resolve('./')];
        }

        return options;
      },
    };
  },
  getCli(options) {
    return Object.entries(options).reduce(
      (acc, [key, value]) => {
        if (key === 'watch' || key === 'version' || key === 'clear') {
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
        dirs: options._,
      }
    );
  },
};
