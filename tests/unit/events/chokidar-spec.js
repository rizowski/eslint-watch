const chokidar = require('chokidar');
const watch = require('../../../src/events/watch/chokidar');

describe('events/chokidar', () => {
  let chokidarStub;

  beforeEach(() => {
    chokidarStub = vi.spyOn(chokidar, 'watch').mockReturnValue({
      on() {},
      add() {},
      unwatch() {},
      close() {},
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a watcher', () => {
    const result = watch.createWatcher(['.']);

    expect(result).toHaveProperty('add');
    expect(result).toHaveProperty('on');
    expect(result).toHaveProperty('unwatch');
    expect(result).toHaveProperty('close');

    expect(chokidarStub).toHaveBeenCalledOnce();
    expect(chokidarStub.mock.calls[0][0]).toEqual(['.']);
    expect(chokidarStub.mock.calls[0][1]).toEqual({ ignored: [/\.git|node_modules|bower_components|\.eslintcache/] });
  });

  it('merges default ignore paths', () => {
    watch.createWatcher(['.'], { ignored: /build|dist/ });

    expect(chokidarStub.mock.calls[0][1]).toEqual({ ignored: [/\.git|node_modules|bower_components|\.eslintcache|build|dist/] });
  });

  it('includes ignorePatterns as glob strings in the ignored array (Bug #189, #194)', () => {
    watch.createWatcher(['.'], { ignorePatterns: ['**/dist/**', '**/build/**'] });

    const ignored = chokidarStub.mock.calls[0][1].ignored;
    expect(Array.isArray(ignored)).toBe(true);
    expect(ignored[0]).toEqual(/\.git|node_modules|bower_components|\.eslintcache/);
    expect(ignored[1]).toBe('**/dist/**');
    expect(ignored[2]).toBe('**/build/**');
  });

  it('passes only the base regex when no ignorePatterns are provided', () => {
    watch.createWatcher(['.']);

    const ignored = chokidarStub.mock.calls[0][1].ignored;
    expect(Array.isArray(ignored)).toBe(true);
    expect(ignored).toHaveLength(1);
    expect(ignored[0]).toEqual(/\.git|node_modules|bower_components|\.eslintcache/);
  });
});
