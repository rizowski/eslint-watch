const { EventEmitter } = require('events');
const watch = require('../../../src/events/watch');
const choki = require('../../../src/events/watch/chokidar');
const key = require('../../../src/events/watch/key-listener');
const linter = require('../../../src/eslint');

describe('events/watch', () => {
  let chokiStub;
  let lintStub;
  let emitter;

  beforeEach(() => {
    emitter = new EventEmitter();
    const watchMock = {
      on(name, callback) {
        emitter.addListener(name, callback);
        return watchMock;
      },
    };

    chokiStub = vi.spyOn(choki, 'createWatcher').mockReturnValue(watchMock);
    lintStub = vi.spyOn(linter, 'lint').mockResolvedValue();
    vi.spyOn(key, 'listen').mockImplementation(() => {});
  });

  afterEach(() => {
    emitter.removeAllListeners();
    vi.restoreAllMocks();
  });

  it('creates a watcher', () => {
    const options = { _: ['./'] };
    watch.listen(options);

    expect(emitter.listeners('add')).toHaveLength(1);
    expect(emitter.listeners('ready')).toHaveLength(1);
    expect(emitter.listeners('change')).toHaveLength(1);
    expect(emitter.listeners('error')).toHaveLength(1);

    expect(chokiStub).toHaveBeenCalledOnce();
    expect(chokiStub.mock.calls[0]).toEqual([['./'], { ignored: undefined, ignorePatterns: [] }]);
  });

  it('lints the directory when a change is detected', async () => {
    const opts = { _: ['./'], watchDelay: 0 };
    watch.listen(opts);

    emitter.emit('change', './some/path.js');

    await new Promise((r) => setTimeout(r, 500));
    expect(lintStub).toHaveBeenCalledOnce();
    expect(lintStub.mock.calls[0]).toEqual([['./'], opts]);
  });

  it('lints the changed path when --changed is provided and a change is detected', async () => {
    const opts = { _: ['./'], changed: true, watchDelay: 0 };
    watch.listen(opts);

    emitter.emit('change', './some/path.js');

    await new Promise((r) => setTimeout(r, 500));
    expect(lintStub).toHaveBeenCalledOnce();
    expect(lintStub.mock.calls[0]).toEqual([['./some/path.js'], opts]);
  });

  it('does not lint files with non-matching ext when --ext is explicitly set', async () => {
    const opts = { _: ['./'], changed: true, ext: ['.js'] };

    watch.listen(opts);

    emitter.emit('change', './some/path.py');

    await new Promise((r) => setTimeout(r, 500));
    expect(lintStub).not.toHaveBeenCalled();
  });

  it('lints all file types when --ext is not provided (Bug #193)', async () => {
    const opts = { _: ['./'], changed: true, watchDelay: 0 };

    watch.listen(opts);

    emitter.emit('change', './some/component.tsx');

    await new Promise((r) => setTimeout(r, 500));
    expect(lintStub).toHaveBeenCalledOnce();
    expect(lintStub.mock.calls[0]).toEqual([['./some/component.tsx'], opts]);
  });

  it('lints .ts files when --ext includes .ts', async () => {
    const opts = { _: ['./'], changed: true, ext: ['.js', '.ts'], watchDelay: 0 };

    watch.listen(opts);

    emitter.emit('change', './some/file.ts');

    await new Promise((r) => setTimeout(r, 500));
    expect(lintStub).toHaveBeenCalledOnce();
  });

  it('runs an initial lint when the ready event is fired', async () => {
    const opts = { _: ['./'], changed: true };
    watch.listen(opts);

    emitter.emit('ready');

    await new Promise((r) => setTimeout(r, 500));
    expect(lintStub).toHaveBeenCalledOnce();
    expect(lintStub.mock.calls[0]).toEqual([['./'], opts]);
  });

  describe('--ignore-pattern support (Bug #194, #189)', () => {
    it('passes ignorePattern to createWatcher', () => {
      const opts = { _: ['./'], ignorePattern: ['**/dist/**'] };
      watch.listen(opts);

      expect(chokiStub.mock.calls[0][1]).toEqual({ ignored: undefined, ignorePatterns: ['**/dist/**'] });
    });

    it('passes multiple ignorePatterns to createWatcher', () => {
      const opts = { _: ['./'], ignorePattern: ['**/dist/**', '**/build/**'] };
      watch.listen(opts);

      expect(chokiStub.mock.calls[0][1]).toEqual({ ignored: undefined, ignorePatterns: ['**/dist/**', '**/build/**'] });
    });

    it('passes empty ignorePatterns when --ignore-pattern is not set', () => {
      const opts = { _: ['./'] };
      watch.listen(opts);

      expect(chokiStub.mock.calls[0][1]).toEqual({ ignored: undefined, ignorePatterns: [] });
    });
  });
});
