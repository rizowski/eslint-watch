const pkg = require('../../../package');
const cmds = require('../../../src/commands');
const version = require('../../../src/commands/version');

describe('commands', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the results of multiple commands', async () => {
    const result = await cmds.run({ version: true, clear: true });

    expect(result).toBe(`\u001b[2J\u001b[0;0f\nEslint-Watch: v${pkg.version}`);
  });

  it('returns empty string if no commands are ran', async () => {
    const result = await cmds.run({});

    expect(result).toBe('');
  });

  it('throws an error if any command errors', async () => {
    vi.spyOn(version, 'run').mockImplementation(() => {
      throw new Error('whoops');
    });

    try {
      await cmds.run({ version: true });
    } catch (error) {
      expect(error.message).toBe('whoops');
    }
  });
});
