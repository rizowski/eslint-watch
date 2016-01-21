import { spawn } from 'child_process';
import path from 'path';
import os from 'os';

import Logger from '../log';

let logger = Logger('eslint-cli');

logger.debug('Loaded');

let cmd = os.platform() === 'win32' ? '.cmd' : '';
let eslint = path.resolve('./node_modules/.bin/eslint' + cmd);
logger.debug('EsLint path: %s', eslint);

export default (args, options={ _: './' }, childOptions={ stdio: 'inherit' }) => {
  if(options._ && !options._.length){
    options._ = './';
  }

  logger.debug('Linting: %o', options._);
  return spawn(eslint, args, childOptions);
};
