import { red, yellow, white } from 'chalk';

export default function errorWarning(result){
  if(result.errorCount || result.warningCount){
    return `${red(result.errorCount)}/${yellow(result.warningCount)} ${white(result.filePath)}`;
  }
  return `${red(result.messages.length)} ${white(result.filePath)}`;
};
