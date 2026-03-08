const pkg = require('../../../package');
const cmd = require('../../../src/commands/version');

describe('commands/version', () => {
  it('triggers on options.version = true', () => {
    expect(cmd.trigger({ version: true })).toBe(true);
  });

  it('does not trigger on options.version = false', () => {
    expect(cmd.trigger({ version: false })).toBe(false);
  });

  it('does not trigger if options.version is true and options.versions is true', () => {
    expect(cmd.trigger({ versions: true, version: true })).toBe(false);
  });

  it('returns eslint-watch version', () => {
    expect(cmd.run()).toBe(`Eslint-Watch: v${pkg.version}`);
  });
});
