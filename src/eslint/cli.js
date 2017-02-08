import _ from 'lodash';
import { spawnSync } from '../executor';
import path from 'path';
import os from 'os';
import fs from 'fs';
import Logger from '../log';

const logger = Logger('eslint-cli');
logger.debug('Loaded');

const windows = os.platform() === 'win32';
const cmd = windows ? '.cmd' : '';

const eslintPath = (function loadEslintPath(){
  let eslintPath;
  try {
    eslintPath = path.join('./', 'node_modules/.bin/eslint' + cmd);
    fs.accessSync(eslintPath);
    logger.debug(`Eslint installed locally ${eslintPath}`);
  } catch (e) {
    try {
      eslintPath = path.join(process.env._, '../eslint' + cmd);
      fs.accessSync(eslintPath);
      logger.debug(`Eslint installed globally ${eslintPath}`);
    } catch (e) {
      throw new Error('Eslint needs to be installed globally or locally.');
    }
  }
  return eslintPath;
})();

logger.debug('EsLint path: %s', eslintPath);

export default function eslintCli(args, options){
  logger.debug('eslint: %o', args);
  return spawnSync(eslintPath, args, _.merge({ stdio: 'inherit' }, options));
};
