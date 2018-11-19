import chokidar from 'chokidar';

const defaultOptions = {
  ignored: /\.git|node_modules|bower_components/,
};

export default {
  createWatcher(dirs, options = {}) {
    const watcher = chokidar.watch(dirs, { ...defaultOptions, ...options });

    return {
      on: watcher.on.bind(watcher),
      add: watcher.add.bind(watcher),
      unwatch: watcher.unwatch.bind(watcher),
      close: watcher.close,
    };
  },
};
