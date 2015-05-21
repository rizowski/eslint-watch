// Template Author Sindre Sorhus @eslint
// https://github.com/sindresorhus/eslint-stylish
'use strict';
var chalk = require('chalk');
var table = require('text-table');

var x = '✖';
var ex = '!';
var endLine = '\n';
var successMessage = chalk.green('✓ Directory Clean \n');

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
  var total = 0;
  var output = '';

  results.forEach(function (result) {
    var messages = result.messages;
    if (!messages.length) {
      return;
    }
    total += messages.length;

    output += chalk.white.underline(result.filePath) + endLine;

    var tableText = table(
      messages.map(function (message) {
        function getMessageType(msg) {
          if (msg.fatal || msg.severity === 2) {
            return chalk.red(x);
          } else {
            return chalk.yellow(ex);
          }
        }

        return ['',
          getMessageType(message),
          message.line || 0,
          message.column || 0,
          chalk.dim(message.message.replace(/\.$/, '')),
          chalk.gray(message.ruleId || '')];
      }), tableSettings);

    output += tableText.split(endLine).map(function (el) {
      return el.replace(/(\d+)\s+(\d+)/, function (m, p1, p2) {
        return chalk.gray(p1 + ':' + p2);
      });
    }).join(endLine) + endLine;

    output += chalk.red(x + ' ' + total + ' ' + pluralize('problem', total) + endLine);
  });

  return output ? output : successMessage;
}

module.exports = simpleDetail;
