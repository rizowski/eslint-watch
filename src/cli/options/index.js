import path from 'path';
import unionwith from 'lodash.unionwith';
import optionator from 'optionator';

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
    description: 'Prints versions',
  },
];

function areEqual(opt1, opt2) {
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
};
