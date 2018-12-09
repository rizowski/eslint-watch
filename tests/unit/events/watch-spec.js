import { EventEmitter } from 'events';
import watch from '../../../src/events/watch';
import choki from '../../../src/events/watch/chokidar';
import key from '../../../src/events/watch/key-listener';
import linter from '../../../src/eslint';

describe('events/watch', () => {
  let sandbox;
  let chokiStub;
  let lintStub;
  let emitter;

  beforeEach(() => {
    emitter = new EventEmitter();
    sandbox = sinon.createSandbox();
    const watchMock = {
      on(name, callback) {
        emitter.addListener(name, callback);
        return watchMock;
      },
    };

    chokiStub = sandbox.stub(choki, 'createWatcher').returns(watchMock);
    lintStub = sandbox.stub(linter, 'lint').resolves();
    sandbox.stub(key, 'listen');
  });

  afterEach(() => {
    emitter.removeAllListeners();
    sandbox.restore();
  });

  it('creates a watcher', () => {
    watch.listen({ _: ['./'] });

    expect(emitter.listeners('add')).to.have.length(1);
    expect(emitter.listeners('ready')).to.have.length(1);
    expect(emitter.listeners('change')).to.have.length(1);
    expect(emitter.listeners('error')).to.have.length(1);

    expect(chokiStub.calledOnce).to.equal(true, 'chokidar called more than once');
    expect(chokiStub.firstCall.args).to.eql([['./'], { ignored: undefined }]);
  });

  it('lints the directory when a change is detected', () => {
    const opts = { _: ['./'] };
    watch.listen(opts);

    emitter.emit('change', './some/path');

    expect(lintStub.calledOnce).to.equal(true);
    expect(lintStub.firstCall.args).to.eql([['./']]);
  });

  it('lints the changed path when --changed is provided and a change is detected', () => {
    const opts = { _: ['./'], changed: true };
    watch.listen(opts);

    emitter.emit('change', './some/path');

    expect(lintStub.calledOnce).to.equal(true);
    expect(lintStub.firstCall.args).to.eql([['./some/path']]);
  });

  it('runs an initial lint when the ready event is fired', () => {
    const opts = { _: ['./'], changed: true };
    watch.listen(opts);

    emitter.emit('ready');

    expect(lintStub.calledOnce).to.equal(true);
    expect(lintStub.firstCall.args).to.eql([['./']]);
  });
});
