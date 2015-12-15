import { green, white } from 'chalk';
import c from './characters';

export default function success(result){
  return `${green(c.check)} ${white(result.filePath)}`;
};
