const pkg = require('../../../package');
const cmd = require('../../../src/commands/versions');

describe('commands/versions', () => {
  it('triggers on options.versions = true', () => {
    expect(cmd.trigger({ versions: true })).toBe(true);
  });

  it('does not trigger on options.versions = false', () => {
    expect(cmd.trigger({ versions: false })).toBe(false);
  });

  it('does not trigger if options.versions is true and options.version is true', () => {
    expect(cmd.trigger({ version: true, versions: true })).toBe(false);
  });

  it('returns eslint and esw versions', async () => {
    const versions = await cmd.run();
    expect(versions).toContain(`Eslint-Watch: v${pkg.version}\n`);
    expect(versions).toContain('Eslint: v');
  });
});
