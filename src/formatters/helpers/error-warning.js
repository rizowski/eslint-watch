import { red, yellow, white } from 'chalk';

export default function errorWarning(result) {
  return result.errorCount || result.warningCount ?
    `${red(result.errorCount)}/${yellow(result.warningCount)} ${white(result.filePath)}` :
    `${red(result.messages.length)} ${white(result.filePath)}`;
};
