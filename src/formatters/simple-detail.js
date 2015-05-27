// Template Author Sindre Sorhus @eslint
// https://github.com/sindresorhus/eslint-stylish
'use strict';
var chalk = require('chalk');
var table = require('text-table');

var x = '✖';
var ex = '!';
var check = '✓';
var endLine = '\n';

var tableSettings = {
  align: ['', '', 'r'],
  stringLength: function (str) {
    return chalk.stripColor(str).length;
  }
};

function pluralize(word, count) {
  return (count === 1 ? word : word + 's');
}

function simpleDetail(results) {
  var totalErrors = 0;
  var totalWarnings = 0;
  var output = '';
  var cleanMsg = '';

  results.forEach(function (result) {
    var messages = result.messages;
    var warnings = 0;
    var errors = 0;
    if (!messages.length) {
      return;
    }

    var tableText = table(
      messages.map(function (message) {
        function getMessageType(msg) {
          if (msg.fatal || msg.severity === 2) {
            totalErrors++;
            errors++;
            return chalk.red(x);
          }

          totalWarnings++;
          warnings++;
          return chalk.yellow(ex);
        }

        return ['',
          getMessageType(message),
          message.line || 0,
          message.column || 0,
          chalk.dim(message.message.replace(/\.$/, '')),
          chalk.gray(message.ruleId || '')];
      }), tableSettings);

    output += chalk.white.underline(result.filePath) + ' (' + chalk.red(errors) + '/' + chalk.yellow(warnings) + ')' + endLine;
    output += tableText.split(endLine).map(function (el) {
      return el.replace(/(\d+)\s+(\d+)/, function (m, p1, p2) {
        return chalk.gray(p1 + ':' + p2);
      });
    }).join(endLine) + endLine + endLine;
  });

  if(totalErrors){
    output += chalk.red(x + ' ' + totalErrors + ' ' + pluralize('problem', totalErrors)) + ' ';
  }
  if (totalWarnings) {
    output += chalk.yellow(ex + ' ' + totalWarnings + ' ' + pluralize('warning', totalWarnings)) + endLine;
  }
  if(results.length > 1){
    cleanMsg = chalk.green(check + ' Clean') + endLine;
  }

  return (totalErrors || totalWarnings) ? output : cleanMsg;
}

module.exports = simpleDetail;
