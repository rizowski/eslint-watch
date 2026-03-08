const cmd = require('../../../src/commands/clear');

describe('commands/clear', () => {
  it('triggers on options.clear', () => {
    expect(cmd.trigger({ clear: true })).toBe(true);
  });

  it('does not trigger on options.clear = false', () => {
    expect(cmd.trigger({ clear: false })).toBe(false);
  });

  it('returns clear screen text', () => {
    expect(cmd.run()).toEqual('\u001B[2J\u001B[0;0f');
  });
});
