import esw from '../../src';
import path from 'path';

import pkg from '../../package';

const testFiles = path.join(__dirname, 'test-files');

describe('integration', () => {
  describe('general', () => {
    it('reports any kind of help information', async () => {
      let output = await esw.run(['--help']);

      expect(output).to.have.string('esw [options]');
    });

    it("cache command doesn't show help", async () => {
      let output = await esw.run(['--cache', '--cache-location', 'node_modules/esw.cache']);
      expect(output).to.not.have.string('[options]');
    });

    it("doesn't throw when a no option is used", async () => {
      await esw.run(['--no-color']);
    });
  });

  describe('help', () => {
    it('has -w and --watch', async () => {
      let output = await esw.run(['--help']);

      expect(output).to.have.string('-w');
      expect(output).to.have.string('--watch');
    });

    it('has stylish as default format', async () => {
      let output = await esw.run(['--help']);

      expect(output).to.have.string('default: stylish');
    });
  });

  describe('watching', () => {
    beforeEach(() => {});

    afterEach(() => {});
  });

  describe('linting', () => {
    it('finds 5 issues in test-files', async () => {
      try {
        await esw.run(['--no-ignore', testFiles]);
      } catch (error) {
        expect(error.message).to.have.string('5 errors');
      }
    });

    it('finds 2 warnings', async () => {
      try {
        await esw.run(['--no-ignore', testFiles]);
      } catch (error) {
        expect(error.message).to.have.string('2 warnings');
      }
    });

    it("doesn't find warnings with --quiet", async () => {
      try {
        await esw.run(['--quiet', '--no-ignore', testFiles]);
      } catch (error) {
        expect(error.message).to.not.have.string('2 warnings');
      }
    });
  });

  describe('version', () => {
    it('prints out eslint-watch version with --esw-version', async () => {
      const output = await esw.run(['--version']);
      expect(output.trim()).to.equal(`Eslint-Watch: v${pkg.version}`);
    });
  });
});
