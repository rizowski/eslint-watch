// Template Author Sindre Sorhus @eslint
// https://github.com/sindresorhus/eslint-stylish
import { gray, red, yellow, white, green, stripColor, dim } from 'chalk';
import table from 'text-table';
import c from './helpers/characters';

let tableSettings = {
  align: ['', '', 'r'],
  stringLength: str => {
    return stripColor(str).length;
  }
};

function pluralize(word, count) {
  return (count === 1 ? word : `${word}s`);
}

function simpleDetail(results) {
  let totalErrors = 0;
  let totalWarnings = 0;
  let output = '';
  let cleanMsg = '';
  let messageTime = gray(`( ${ new Date().toLocaleTimeString() })`);

  results.forEach(result => {
    let messages = result.messages;
    let warnings = 0;
    let errors = 0;
    if (!messages.length) {
      return;
    }

    let tableText = table(
      messages.map(message => {
        function getMessageType(msg) {
          if (msg.fatal || msg.severity === 2) {
            totalErrors++;
            errors++;
            return red(c.x);
          }

          totalWarnings++;
          warnings++;
          return yellow(c.ex);
        }

        return ['',
          getMessageType(message),
          message.line || 0,
          message.column || 0,
          dim(message.message.replace(/\.$/, '')),
          gray(message.ruleId || '')];
      }), tableSettings);

    output += `${white.underline(result.filePath)} (${red(errors)}/${yellow(warnings)})\n`;
    output += tableText.split('\n').map(el => {
      return el.replace(/(\d+)\s+(\d+)/, (m, p1, p2) => {
        return gray(`${p1}:${p2}`);
      });
    }).join('\n') + '\n\n';
  });

  if(totalErrors) {
    output += red(`${c.x} ${totalErrors} ${pluralize('error', totalErrors)}`) + ' ';
  }
  if (totalWarnings) {
    output += yellow(`${c.ex} ${totalWarnings} ${pluralize('warning', totalWarnings)}`) + ' ';
  }

  if(results.length > 1 || results.length === 0) {
    cleanMsg = `${green(`${c.check} Clean`)} ${messageTime}\n`;
  }

  output = (totalErrors || totalWarnings) ? output + messageTime + '\n' : cleanMsg;

  return output;
}

export default simpleDetail;
