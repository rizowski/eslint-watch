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
    const options = { _: ['./'], ext: ['.js'] };
    watch.listen(options);

    expect(emitter.listeners('add')).to.have.length(1);
    expect(emitter.listeners('ready')).to.have.length(1);
    expect(emitter.listeners('change')).to.have.length(1);
    expect(emitter.listeners('error')).to.have.length(1);

    expect(chokiStub.calledOnce).to.equal(true, 'chokidar called more than once');
    expect(chokiStub.firstCall.args).to.eql([['./'], { ignored: undefined }]);
  });

  it('lints the directory when a change is detected', (done) => {
    const opts = { _: ['./'], ext: ['.js'] };
    watch.listen(opts);

    emitter.emit('change', './some/path.js');

    setTimeout(() => {
      try {
        expect(lintStub.calledOnce).to.equal(true);
        expect(lintStub.firstCall.args).to.eql([['--ext', ['.js'], './'], opts]);
        done();
      } catch (error) {
        done(error);
      }
    }, 0);
  });

  it('lints the changed path when --changed is provided and a change is detected', (done) => {
    const opts = { _: ['./'], changed: true, ext: ['.js'] };
    watch.listen(opts);

    emitter.emit('change', './some/path.js');

    setTimeout(() => {
      try {
        expect(lintStub.calledOnce).to.equal(true);
        expect(lintStub.firstCall.args).to.eql([['--ext', ['.js'], './some/path.js'], opts]);
        done();
      } catch (error) {
        done(error);
      }
    }, 0);
  });

  it('does not lint non js files', (done) => {
    const opts = { _: ['./'], changed: true, ext: ['.js'] };

    watch.listen(opts);

    emitter.emit('change', './some/path.py');

    setTimeout(() => {
      try {
        expect(lintStub.called).to.equal(false);
        done();
      } catch (error) {
        done(error);
      }
    }, 0);
  });

  it('runs an initial lint when the ready event is fired', (done) => {
    const opts = { _: ['./'], changed: true, ext: ['.js'] };
    watch.listen(opts);

    emitter.emit('ready');

    setTimeout(() => {
      try {
        expect(lintStub.calledOnce).to.equal(true);
        expect(lintStub.firstCall.args).to.eql([['--ext', ['.js'], './'], opts]);
        done();
      } catch (error) {
        done(error);
      }
    }, 0);
  });
});
