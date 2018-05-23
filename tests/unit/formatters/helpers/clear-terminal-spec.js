import clear from '../../../../src/formatters/helpers/clear-terminal';

describe('clear terminal', () => {
  let sandbox;
  let spy;

  before(() => {
    sandbox = sinon.sandbox.create();
    spy = sandbox.spy(process.stdout, 'write');
  });

  after(() => {
    sandbox.restore();
  });

  it('calls process.stdout.write with the clear command', () => {
    clear();

    expect(spy.firstCall.args[0]).to.equal('\u001B[2J\u001B[0;0f');
  });
});
