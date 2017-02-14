import chalk from 'chalk';

import c from './characters';
import Logger from '../../logger';

const logger = Logger('success-formatter');
logger.debug('loaded');

export default function successHelper(result){
  logger.debug(result);
  return `${chalk.green(c.check)} ${chalk.white(result.filePath)}`;
};
