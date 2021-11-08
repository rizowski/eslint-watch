module.exports = {
  name: 'clear',
  trigger(options) {
    return options.clear;
  },
  run() {
    return '\u001B[2J\u001B[0;0f';
  },
};
