/* Internal Settings */
import os from 'os';
import Logger from './log';
import path from 'path';
import fs from 'fs';

const logger = Logger('internal-settings');
const platform = os.platform();

const eslintPath = (function loadEslintPath(){
  const cmd = platform === 'win32' ? '.cmd' : '';
  let eslintPath;
  try {
    eslintPath = path.join('./', `node_modules/.bin/eslint${cmd}`);
    fs.accessSync(eslintPath);
    logger.debug(`Eslint installed locally ${eslintPath}`);
  } catch (e) {
    logger.debug(e);
    try {
      eslintPath = path.join(process.env._, `../eslint${cmd}`);
      fs.accessSync(eslintPath);
      logger.debug(`Eslint installed globally ${eslintPath}`);
    } catch (e) {
      throw new Error('Eslint needs to be installed globally or locally in node_modules.');
    }
  }
  return eslintPath;
})();

const settings = {
  eslintPath,
  platform,
  isWindows: platform === 'win32',
};

logger.debug(settings);

export default settings;
