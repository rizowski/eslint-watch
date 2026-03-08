const path = require('path');
const esw = require('../../src');
const pkg = require('../../package');

describe('integration', () => {
  const preStuff = ['node', 'bin'];
  const testFiles = path.join(__dirname, 'test-files');
  const testConfig = path.join(testFiles, 'eslint.config.js');

  describe('general', () => {
    it('reports any kind of help information', async () => {
      const output = await esw.run([...preStuff, '--help']);

      expect(output).toContain('esw [options]');
    });

    it("cache command doesn't show help", async () => {
      const output = await esw.run([...preStuff, '--cache', '--cache-location', 'node_modules/esw.cache']);
      expect(output).not.toContain('[options]');
    });

    it("doesn't throw when a no option is used", async () => {
      await esw.run([...preStuff, '--no-color']);
    });
  });

  describe('help', () => {
    it('has -w and --watch', async () => {
      const output = await esw.run([...preStuff, '--help']);

      expect(output).toContain('-w');
      expect(output).toContain('--watch');
    });

    it('has stylish as default format', async () => {
      const output = await esw.run([...preStuff, '--help']);

      expect(output).toContain('default: stylish');
    });

    it('includes v9 options like --no-config-lookup', async () => {
      const output = await esw.run([...preStuff, '--help']);

      expect(output).toContain('--no-config-lookup');
    });

    it('does not include removed v8 options like --eslintrc', async () => {
      const output = await esw.run([...preStuff, '--help']);

      expect(output).not.toContain('--no-eslintrc');
      expect(output).not.toContain('--env [String]');
      expect(output).not.toContain('--rulesdir');
      expect(output).not.toContain('--ignore-path');
    });
  });

  describe('linting', () => {
    it('finds 5 errors in test-files', async () => {
      try {
        await esw.run([...preStuff, '--config', testConfig, testFiles]);
      } catch (error) {
        expect(error.message).toContain('5 errors');
      }
    });

    it('finds 2 warnings', async () => {
      try {
        await esw.run([...preStuff, '--config', testConfig, testFiles]);
      } catch (error) {
        expect(error.message).toContain('2 warnings');
      }
    });

    it("doesn't find warnings with --quiet", async () => {
      try {
        await esw.run([...preStuff, '--quiet', '--config', testConfig, testFiles]);
      } catch (error) {
        expect(error.message).not.toContain('2 warnings');
      }
    });
  });

  describe('rule', () => {
    it('parses inline rules correctly', async () => {
      const result = await esw.run([...preStuff, '--rule', 'no-unused-vars: off', '--quiet', '--config', testConfig, testFiles]);

      expect(result).toEqual('');
    });
  });

  describe('version', () => {
    it('prints out eslint-watch version with --esw-version', async () => {
      const output = await esw.run([...preStuff, '--version']);
      expect(output.trim()).toBe(`Eslint-Watch: v${pkg.version}`);
    });
  });
});
