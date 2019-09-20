import chokidar from 'chokidar';
import watch from '../../../src/events/watch/chokidar';

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

    expect(result)
      .to.be.an('object')
      .and.to.have.keys(['add', 'on', 'unwatch', 'close']);

    expect(chokidarStub.calledOnce).to.equal(true, 'chokidar was not called once');
    expect(chokidarStub.firstCall.args[0]).to.eql(['.']);
    expect(chokidarStub.firstCall.args[1]).to.eql({ ignored: /\.git|node_modules|bower_components|\.eslintcache/ });
  });

  it('merges default ignore paths', () => {
    watch.createWatcher(['.'], { ignored: /build|dist/ });

    expect(chokidarStub.firstCall.args[1]).to.eql({ ignored: /\.git|node_modules|bower_components|\.eslintcache|build|dist/ });
  });
});
