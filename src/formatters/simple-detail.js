// Template Author Sindre Sorhus @eslint
// https://github.com/sindresorhus/eslint-stylish
import chalk from 'chalk';
import table from 'text-table';
import strip from 'strip-ansi';

import c from './helpers/characters';
import Logger from '../logger';

const logger = Logger('simple-detail');

logger.debug('loaded');

let tableSettings = {
  align: ['', '', 'r'],
  stringLength: (str) => strip(str).length
};

function pluralize(word, count) {
  return (count === 1 ? word : word + 's');
}

function simpleDetail(results) {
  let totalErrors = 0;
  let totalWarnings = 0;
  let output = '';
  let cleanMsg = '';
  let messageTime = chalk.dim(`(${new Date().toLocaleTimeString()})`);
  logger.debug(results);
  results.forEach(function (result) {
    let messages = result.messages;
    let warnings = 0;
    let errors = 0;
    if (!messages.length) {
      return;
    }
    const tableContents = messages.map(function (message) {
      function getMessageType(msg) {
        if (msg.fatal || msg.severity === 2) {
          totalErrors++;
          errors++;
          return chalk.red(c.x);
        }

        totalWarnings++;
        warnings++;
        return chalk.yellow(c.ex);
      }

      return ['',
        getMessageType(message),
        message.line || 0,
        message.column || 0,
        chalk.dim(message.message.replace(/\.$/, '')),
        chalk.dim(message.ruleId || '')];
    });

    const tableText = table(tableContents, tableSettings);

    output += chalk.white.underline(result.filePath) + ` (${chalk.red(errors)}/${chalk.yellow(warnings)})${c.endLine}`;
    output += tableText.split(c.endLine).map(function (el) {
      return el.replace(/(\d+)\s+(\d+)/, (m, p1, p2) => chalk.dim(`${p1}:${p2}`));
    }).join(c.endLine) + c.endLine + c.endLine;
  });

  if (totalErrors) {
    output += chalk.red(`${c.x} ${totalErrors} ${pluralize('error', totalErrors)} `);
  }
  if (totalWarnings) {
    output += chalk.yellow(`${c.ex} ${totalWarnings} ${pluralize('warning', totalWarnings)} `);
  }

  if (results.length > 0 || !results.length) {
    cleanMsg = chalk.green(`${c.check} Clean`) + ` ${messageTime}`;
  }

  output = (totalErrors || totalWarnings)
    ? `${output}${messageTime}${c.endLine}`
    : cleanMsg;

  return output;
}

export default simpleDetail;
