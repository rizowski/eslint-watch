import { red, yellow, white } from 'chalk';

export default function errorWarning({ errorCount, warningCount, filePath, messages }) {
  return errorCount || warningCount
    ? `${red(errorCount)}/${yellow(warningCount)} ${white(filePath)}`
    : `${red(messages.length)} ${white(filePath)}`;
};
