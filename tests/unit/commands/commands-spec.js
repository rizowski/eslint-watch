const pkg = require('../../../package');
const cmds = require('../../../src/commands');
const version = require('../../../src/commands/version');

describe('commands', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('returns the results of multiple commands', async () => {
    const result = await cmds.run({ version: true, clear: true });

    expect(result).to.equal(`\u001b[2J\u001b[0;0f\nEslint-Watch: v${pkg.version}`);
  });

  it('returns empty string if no commands are ran', async () => {
    const result = await cmds.run({});

    expect(result).to.equal('');
  });

  it('throws an error if any command errors', async () => {
    sandbox.stub(version, 'run').throws(new Error('whoops'));

    try {
      await cmds.run({ version: true });
    } catch (error) {
      expect(error.message).to.equal('whoops');
    }
  });
});
