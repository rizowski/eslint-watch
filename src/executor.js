import { spawnSync } from 'child_process';

import Logger from './log';
const logger = Logger('executor');

export default {
  // https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options
  spawnSync: (cmd, args, childOptions) => {
    logger.debug(cmd, args);
    const child = spawnSync(cmd, args, childOptions);
    if(child.error){
      logger.debug('Critical error occurred.');
      throw new Error(child.stderr.toString());
    }
    return {
      exitCode: child.status,
      message: child.stdout ? child.stdout.toString() : ''
    };
  }
};
