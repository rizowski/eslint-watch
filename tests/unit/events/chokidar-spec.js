const chokidar = require('chokidar');
const watch = require('../../../src/events/watch/chokidar');

describe('events/chokidar', () => {
  let sandbox;
  let chokidarStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    chokidarStub = sandbox.stub(chokidar, 'watch').returns({
      on() {},
      add() {},
      unwatch() {},
      close() {},
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('creates a watcher', () => {
    const result = watch.createWatcher(['.']);

    expect(result).to.be.an('object').and.to.have.keys(['add', 'on', 'unwatch', 'close']);

    expect(chokidarStub.calledOnce).to.equal(true, 'chokidar was not called once');
    expect(chokidarStub.firstCall.args[0]).to.eql(['.']);
    expect(chokidarStub.firstCall.args[1]).to.eql({ ignored: [/\.git|node_modules|bower_components|\.eslintcache/] });
  });

  it('merges default ignore paths', () => {
    watch.createWatcher(['.'], { ignored: /build|dist/ });

    expect(chokidarStub.firstCall.args[1]).to.eql({ ignored: [/\.git|node_modules|bower_components|\.eslintcache|build|dist/] });
  });

  it('includes ignorePatterns as glob strings in the ignored array (Bug #189, #194)', () => {
    watch.createWatcher(['.'], { ignorePatterns: ['**/dist/**', '**/build/**'] });

    const ignored = chokidarStub.firstCall.args[1].ignored;
    expect(ignored).to.be.an('array');
    expect(ignored[0]).to.eql(/\.git|node_modules|bower_components|\.eslintcache/);
    expect(ignored[1]).to.equal('**/dist/**');
    expect(ignored[2]).to.equal('**/build/**');
  });

  it('passes only the base regex when no ignorePatterns are provided', () => {
    watch.createWatcher(['.']);

    const ignored = chokidarStub.firstCall.args[1].ignored;
    expect(ignored).to.be.an('array');
    expect(ignored).to.have.length(1);
    expect(ignored[0]).to.eql(/\.git|node_modules|bower_components|\.eslintcache/);
  });
});
