import _ from 'lodash';
import { spawn } from '../executor';
import Logger from '../logger';
import settings from '../settings';

const logger = Logger('eslint-cli');
logger.debug('Loaded');

export default function eslintCli(args, options, cb) {
  logger.debug('eslint: %o', args.join(' '));
  spawn(settings.eslintPath, args, options, cb);
};
