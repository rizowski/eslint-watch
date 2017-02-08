import { spawn, spawnSync } from 'child_process';
var _ = require('lodash');
var Logger = require('./log');

var logger = Logger('executor');

module.exports = {
  spawn: function(cmd, args, options, callback){
    options = _.merge({}, options, {
      stdio: [process.stdin, 'pipe', 'pipe']
    });
    logger.debug('Running: %s', cmd);
    logger.debug('args: %o', args);
    var data = [];
    var error = [];
    var crashed = false;
    var crashData = null;
    var proc = spawn(cmd, args, options);

    proc.on('error', function(e){
      logger.debug('Process error:', e);
      crashed = true;
      crashData = e;
    });

    proc.on('exit', function(code){
      logger.debug('External process exited:', code);
      callback({
        exitCode: code,
        fatal: crashed,
        cmd: cmd,
        args: args,
        output: data.join('').trim() || error.join('').trim() || crashData
      });
    });

    proc.stdout.on('data', function(line){
      logger.debug('Expected data: %s', line);
      data.push(line);
    });

    proc.stderr.on('data', function(line){
      logger.debug('expected error: %s', line);
      error.push(line);
    });
  },
  // https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options
  spawnSync: (cmd, args, childOptions) => {
    logger.debug(cmd);
    logger.debug(args);
    let child = spawnSync(cmd, args, childOptions);
    if(child.error){
      throw new Error(child.stderr.toString());
    }
    return child.output.toString();;
  }
};
