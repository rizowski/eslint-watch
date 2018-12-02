import chokidar from 'chokidar';
import createLogger from '../../logger';

const logger = createLogger('watch:chokidar');

const defaultOptions = {
  ignored: /\.git|node_modules|bower_components/,
};

export default {
  createWatcher(dirs, options = {}) {
    logger.debug('Watching %o %o', dirs, options);
    const watcher = chokidar.watch(dirs, { ...defaultOptions, ...options });

    return {
      on: watcher.on.bind(watcher),
      add: watcher.add.bind(watcher),
      unwatch: watcher.unwatch.bind(watcher),
      close: watcher.close,
    };
  },
};
