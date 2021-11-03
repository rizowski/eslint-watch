const isEmpty = require('lodash.isempty');

const { createLogger } = require('../logger');

const logger = createLogger('eslint-help');
logger.debug('Loaded');

const namedOption = /^--/;
const header = /^(\w+(\s+)?)+:$/i;

function parseNo(option, str) {
  if (!str) {
    return;
  }

  let cmd = str.replace('--', '');

  if (/no-/.test(cmd)) {
    logger.debug('Parsing no option', str);
    cmd = cmd.replace('no-', '');
    option.default = 'true';
  }

  option.option = cmd;

  return option;
}

function parseDouble(arr) {
  const description = arr.slice(2).filter(Boolean).join(' ');

  const [option, alias] = arr;

  return {
    option: option.replace('--', ''),
    type: 'Boolean',
    alias: alias.replace('--', ''),
    description,
  };
}

function parseRegular(arr) {
  const [item] = arr;
  logger.debug('Parsing %s', item);

  if (!item) {
    return;
  }

  const [optionText] = arr;
  const type = arr[1] || 'Boolean';
  const option = parseNo({}, optionText);
  const helpText = arr.filter((a) => a !== optionText && a !== type && a !== '');
  const description = helpText.join(' ');

  option.type = type;

  if (description) {
    option.description = description;
  }

  return option;
}

function parseAlias(arr = []) {
  const [alias] = arr;

  logger.debug('Alias found: %s', alias);
  const option = parseRegular(arr.filter((a) => a !== alias));

  if (alias) {
    option.alias = alias.replace('-', '');
  }

  return option;
}

function createOption(arr) {
  let option;

  if (namedOption.test(arr[0]) && namedOption.test(arr[1])) {
    // Negated boolean
    option = parseDouble(arr);
  } else if (namedOption.test(arr[0]) && !namedOption.test(arr[1])) {
    // No alias
    option = parseRegular(arr);
  } else {
    // Aliased or other
    option = parseAlias(arr);
  }

  return isEmpty(option) ? undefined : option;
}

function parseHelp(helpText) {
  return helpText.split('\n').reduce((acc, line, index) => {
    if (!line || index === 0) {
      return acc;
    }

    if (index === 0) {
      return acc;
    }

    if (header.test(line)) {
      acc.push({ heading: line.replace(':', '') });

      return acc;
    }

    const lineArr = line.replace(',', '').trim().split(' ');

    const option = createOption(lineArr);

    if (option.option === 'help') {
      return acc;
    }

    acc.push(option);

    return acc;
  }, []);
}

module.exports = {
  parseHelp,
};
