import debug from 'debug';

export default thing => {
  return {
    log: console.log,
    error: console.error,
    debug: debug('esw:' + thing)
  };
};
