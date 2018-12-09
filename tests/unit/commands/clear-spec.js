import cmd from '../../../src/commands/clear';

describe('commands/clear', () => {
  it('triggers on options.clear', () => {
    expect(cmd.trigger({ clear: true })).to.equal(true);
  });

  it('does not trigger on options.clear = false', () => {
    expect(cmd.trigger({ clear: false })).to.equal(false);
  });

  it('returns clear screen text', () => {
    expect(cmd.run()).to.eql('\u001B[2J\u001B[0;0f');
  });
});
