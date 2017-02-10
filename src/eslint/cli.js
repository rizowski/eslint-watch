import _ from 'lodash';
import { spawnSync } from '../executor';
import Logger from '../log';
import settings from '../settings';

const logger = Logger('eslint-cli');
logger.debug('Loaded');

export default function eslintCli(args, options){
  logger.debug('eslint: %o', args);
  const result = spawnSync(settings.eslintPath, args, _.merge({ stdio: 'inherit' }, options));
  logger.debug(result);
  return result;
};
