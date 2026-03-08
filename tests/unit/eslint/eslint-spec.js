const logger = require('../../../src/logger');
const eslint = require('../../../src/eslint');

describe('eslint/options', () => {
  describe('#getHelpOptions', () => {
    it('returns options for optionator', async () => {
      const options = await eslint.getHelpOptions();

      expect(Array.isArray(options)).toBe(true);

      options.forEach((o) => {
        if (o.heading) {
          expect(typeof o.heading).toBe('string');
          return;
        }

        expect(o).toHaveProperty('description');
        expect(o).toHaveProperty('option');
        expect(o).toHaveProperty('type');
        if (o.alias) {
          expect(typeof o.alias).toBe('string');
        }
      });
    });
  });

  describe('#lint', () => {
    let loggerStub;

    beforeAll(() => {
      loggerStub = {
        log: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
      };
      vi.spyOn(logger, 'createLogger').mockImplementation(() => loggerStub);
      vi.spyOn(eslint, 'execute').mockResolvedValue('');
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    afterAll(() => {
      vi.restoreAllMocks();
    });

    it('logs the clean message if no results come back ', async () => {
      await eslint.lint(['./tests/integration/test-files']);

      expect(loggerStub.error).not.toHaveBeenCalled();
      expect(loggerStub.log).toHaveBeenCalledOnce();
      expect(loggerStub.log.mock.calls[0][0]).toContain('✓ Clean');
    });

    it('does not log clean if quiet is provided', async () => {
      await eslint.lint(['.'], { quiet: true });

      expect(loggerStub.error).not.toHaveBeenCalled();
      expect(loggerStub.log).not.toHaveBeenCalled();
    });
  });
});
