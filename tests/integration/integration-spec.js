const path = require('path');
const esw = require('../../src');
const pkg = require('../../package');

describe('integration', () => {
  const preStuff = ['node', 'bin'];
  const testFiles = path.join(__dirname, 'test-files');

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
  });

  describe('linting', () => {
    it('finds 5 issues in test-files', async () => {
      try {
        await esw.run([...preStuff, '--no-ignore', testFiles]);
      } catch (error) {
        expect(error.message).to.have.string('5 errors');
      }
    });

    it('finds 2 warnings', async () => {
      try {
        await esw.run([...preStuff, '--no-ignore', testFiles]);
      } catch (error) {
        expect(error.message).to.have.string('2 warnings');
      }
    });

    it("doesn't find warnings with --quiet", async () => {
      try {
        await esw.run([...preStuff, '--quiet', '--no-ignore', testFiles]);
      } catch (error) {
        expect(error.message).to.not.have.string('2 warnings');
      }
    });
  });

  describe('rule', () => {
    it('parses inline rules correctly', async () => {
      const result = await esw.run([...preStuff, '--rule', 'no-unused-vars: off', '--quiet', '--no-ignore', testFiles]);

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
