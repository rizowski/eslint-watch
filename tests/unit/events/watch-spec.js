const { EventEmitter } = require('events');
const watch = require('../../../src/events/watch');
const choki = require('../../../src/events/watch/chokidar');
const key = require('../../../src/events/watch/key-listener');
const linter = require('../../../src/eslint');

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
    const options = { _: ['./'] };
    watch.listen(options);

    expect(emitter.listeners('add')).to.have.length(1);
    expect(emitter.listeners('ready')).to.have.length(1);
    expect(emitter.listeners('change')).to.have.length(1);
    expect(emitter.listeners('error')).to.have.length(1);

    expect(chokiStub.calledOnce).to.equal(true, 'chokidar called more than once');
    expect(chokiStub.firstCall.args).to.eql([['./'], { ignored: undefined, ignorePatterns: [] }]);
  });

  it('lints the directory when a change is detected', (done) => {
    const opts = { _: ['./'], watchDelay: 0 };
    watch.listen(opts);

    emitter.emit('change', './some/path.js');

    setTimeout(() => {
      try {
        expect(lintStub.calledOnce).to.equal(true);
        expect(lintStub.firstCall.args).to.eql([['./'], opts]);
        done();
      } catch (error) {
        done(error);
      }
    }, 300);
  });

  it('lints the changed path when --changed is provided and a change is detected', (done) => {
    const opts = { _: ['./'], changed: true, watchDelay: 0 };
    watch.listen(opts);

    emitter.emit('change', './some/path.js');

    setTimeout(() => {
      try {
        expect(lintStub.calledOnce).to.equal(true);
        expect(lintStub.firstCall.args).to.eql([['./some/path.js'], opts]);
        done();
      } catch (error) {
        done(error);
      }
    }, 300);
  });

  it('does not lint files with non-matching ext when --ext is explicitly set', (done) => {
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
    }, 300);
  });

  it('lints all file types when --ext is not provided (Bug #193)', (done) => {
    const opts = { _: ['./'], changed: true, watchDelay: 0 };

    watch.listen(opts);

    emitter.emit('change', './some/component.tsx');

    setTimeout(() => {
      try {
        expect(lintStub.calledOnce).to.equal(true);
        expect(lintStub.firstCall.args).to.eql([['./some/component.tsx'], opts]);
        done();
      } catch (error) {
        done(error);
      }
    }, 300);
  });

  it('lints .ts files when --ext includes .ts', (done) => {
    const opts = { _: ['./'], changed: true, ext: ['.js', '.ts'], watchDelay: 0 };

    watch.listen(opts);

    emitter.emit('change', './some/file.ts');

    setTimeout(() => {
      try {
        expect(lintStub.calledOnce).to.equal(true);
        done();
      } catch (error) {
        done(error);
      }
    }, 300);
  });

  it('runs an initial lint when the ready event is fired', (done) => {
    const opts = { _: ['./'], changed: true };
    watch.listen(opts);

    emitter.emit('ready');

    setTimeout(() => {
      try {
        expect(lintStub.calledOnce).to.equal(true);
        expect(lintStub.firstCall.args).to.eql([['./'], opts]);
        done();
      } catch (error) {
        done(error);
      }
    }, 300);
  });

  describe('--ignore-pattern support (Bug #194, #189)', () => {
    it('passes ignorePattern to createWatcher', () => {
      const opts = { _: ['./'], ignorePattern: ['**/dist/**'] };
      watch.listen(opts);

      expect(chokiStub.firstCall.args[1]).to.eql({ ignored: undefined, ignorePatterns: ['**/dist/**'] });
    });

    it('passes multiple ignorePatterns to createWatcher', () => {
      const opts = { _: ['./'], ignorePattern: ['**/dist/**', '**/build/**'] };
      watch.listen(opts);

      expect(chokiStub.firstCall.args[1]).to.eql({ ignored: undefined, ignorePatterns: ['**/dist/**', '**/build/**'] });
    });

    it('passes empty ignorePatterns when --ignore-pattern is not set', () => {
      const opts = { _: ['./'] };
      watch.listen(opts);

      expect(chokiStub.firstCall.args[1]).to.eql({ ignored: undefined, ignorePatterns: [] });
    });
  });
});
