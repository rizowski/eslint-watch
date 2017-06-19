import { spawn } from 'child_process';

import Logger from './logger';
const logger = Logger('executor');

export default {
  spawn: (cmd, args, childOptions, cb) => {
    logger.debug(cmd, args);
    const child = spawn(cmd, args, childOptions);
    let output = '';

    child.on('error', () => {
      logger.debug('Critical error occurred.');
      throw new Error(child.stderr.toString());
    });

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.on('close', (code) => {
      cb({
        exitCode: code,
        message: output || ''
      });
    });
  }
};
