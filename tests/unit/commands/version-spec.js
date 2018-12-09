import pkg from '../../../package';
import cmd from '../../../src/commands/version';

describe('commands/version', () => {
  it('triggers on options.version = true', () => {
    expect(cmd.trigger({ version: true })).to.equal(true);
  });

  it('does not trigger on options.version = false', () => {
    expect(cmd.trigger({ version: false })).to.equal(false);
  });

  it('does not trigger if options.version is true and options.versions is true', () => {
    expect(cmd.trigger({ versions: true, version: true })).to.equal(false);
  });

  it('returns eslint-watch version', () => {
    expect(cmd.run()).to.equal(`Eslint-Watch: v${pkg.version}`);
  });
});
