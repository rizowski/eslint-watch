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

      expect(output).to.have.string('esw [options]');
    });

    it("cache command doesn't show help", async () => {
      const output = await esw.run([...preStuff, '--cache', '--cache-location', 'node_modules/esw.cache']);
      expect(output).to.not.have.string('[options]');
    });

    it("doesn't throw when a no option is used", async () => {
      await esw.run([...preStuff, '--no-color']);
    });
  });

  describe('help', () => {
    it('has -w and --watch', async () => {
      const output = await esw.run([...preStuff, '--help']);

      expect(output).to.have.string('-w');
      expect(output).to.have.string('--watch');
    });

    it('has stylish as default format', async () => {
      const output = await esw.run([...preStuff, '--help']);

      expect(output).to.have.string('default: stylish');
    });

    it('includes v9 options like --no-config-lookup', async () => {
      const output = await esw.run([...preStuff, '--help']);

      expect(output).to.have.string('--no-config-lookup');
    });

    it('does not include removed v8 options like --eslintrc', async () => {
      const output = await esw.run([...preStuff, '--help']);

      expect(output).to.not.have.string('--no-eslintrc');
      expect(output).to.not.have.string('--env [String]');
      expect(output).to.not.have.string('--rulesdir');
      expect(output).to.not.have.string('--ignore-path');
    });
  });

  describe('linting', () => {
    it('finds 5 errors in test-files', async () => {
      try {
        await esw.run([...preStuff, '--config', testConfig, testFiles]);
      } catch (error) {
        expect(error.message).to.have.string('5 errors');
      }
    });

    it('finds 2 warnings', async () => {
      try {
        await esw.run([...preStuff, '--config', testConfig, testFiles]);
      } catch (error) {
        expect(error.message).to.have.string('2 warnings');
      }
    });

    it("doesn't find warnings with --quiet", async () => {
      try {
        await esw.run([...preStuff, '--quiet', '--config', testConfig, testFiles]);
      } catch (error) {
        expect(error.message).to.not.have.string('2 warnings');
      }
    });
  });

  describe('rule', () => {
    it('parses inline rules correctly', async () => {
      const result = await esw.run([...preStuff, '--rule', 'no-unused-vars: off', '--quiet', '--config', testConfig, testFiles]);

      expect(result).to.eql('');
    });
  });

  describe('version', () => {
    it('prints out eslint-watch version with --esw-version', async () => {
      const output = await esw.run([...preStuff, '--version']);
      expect(output.trim()).to.equal(`Eslint-Watch: v${pkg.version}`);
    });
  });
});
