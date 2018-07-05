import child from 'child_process';
import path from 'path';
import table from 'text-table';

import pkg from '../../package';

const eswPath = path.join(__dirname, '../../bin/esw');
const testFiles = path.join(__dirname, 'test-files');

function normalize(str) {
  return path.join(str);
}

describe('integration', function() {
  let esw;
  before(function() {
    esw = function(cmd) {
      let result = {};
      try {
        let command = `node "${eswPath}" ${cmd}`;
        result.message = child.execSync(command).toString();
        result.error = false;
      } catch (e) {
        result.error = true;
        result.message = e.stdout.toString();
        result.cmd = e.cmd;
      }
      return result;
    };
  });

  describe('general', function() {
    it('reports any kind of help information', function() {
      let output = esw('--help');
      expect(output.error).to.be.false;
      expect(output.message).to.have.string('esw [options]');
    });

    it("cache command doesn't show help", function() {
      let output = esw('--cache --cache-location node_modules/esw.cache');
      expect(output.error).to.be.false;
      expect(output.message).to.not.have.string('Options');
    });

    it("doesn't throw when a no option is used", function() {
      let output = esw('--no-color');
      expect(output.error).to.be.false;
    });
  });

  describe('help', function() {
    it('has -w and --watch', function() {
      let output = esw('--help');
      expect(output.error).to.be.false;
      expect(output.message).to.have.string('-w');
      expect(output.message).to.have.string('--watch');
    });

    it('has simple-detail as default format', function() {
      let output = esw('--help');
      expect(output.error).to.be.false;
      expect(output.message).to.have.string('default: simple-detail');
    });
  });

  describe('watching', function() {
    beforeEach(function() {});

    afterEach(function() {});
  });

  describe('formatters', () => {
    describe('no warnings', () => {
      it("can find eslint's table format", () => {
        const { error, message } = esw(`-f table --quiet --no-ignore "${testFiles}"`);

        expect(error).to.be.true;
        expect(message).to.have.string('Line');
        expect(message).to.have.string('Column');
        expect(message).to.have.string('Type');
        expect(message).to.have.string('Message');
        expect(message).to.have.string('Rule ID');

        expect(message).to.have.string('error');
        expect(message).to.have.string('5 Errors');
        expect(message).to.have.string('0 Warnings');
      });

      it('can find simple-detail', () => {
        const { error, message } = esw(`-f simple-detail --quiet --no-ignore "${testFiles}"`);
        const fileA = table([
          ['', '✖', '1:10', "'a' is defined but never used", 'no-unused-vars'],
          ['', '✖', '4:5', "'blah' is assigned a value but never used", 'no-unused-vars'],
          ['', '✖', '5:5', "'_notPrivates' is assigned a value but never used", 'no-unused-vars'],
        ]);
        const fileB = table([
          ['', '✖', '3:5', "'somethng' is assigned a value but never used", 'no-unused-vars'],
          ['', '✖', '5:10', "'_reallyNotPrivate' is defined but never used", 'no-unused-vars'],
        ]);

        expect(error).to.be.true;
        expect(message).to.have.string(normalize('tests/integration/test-files/sub1/a.js') + ' (3/0)');
        expect(message).to.have.string(fileA);
        expect(message).to.have.string(normalize('tests/integration/test-files/sub2/b.js') + ' (2/0)');
        expect(message).to.have.string(fileB);
        expect(message).to.have.string('✖ 5 errors');
      });

      it('can find simple-success', () => {
        const { error, message } = esw(`-f simple-success --quiet --no-ignore "${testFiles}"`);

        expect(error).to.be.true;
        expect(message).to.have.string('3/0');
        expect(message).to.have.string(normalize('test-files/sub1/a.js'));
        expect(message).to.have.string('2/0');
        expect(message).to.have.string(normalize('test-files/sub2/b.js'));
      });

      it('can find simple', () => {
        const { error, message } = esw(`-f simple --quiet --no-ignore "${testFiles}"`);

        expect(error).to.be.true;
        expect(message).to.have.string('3/0');
        expect(message).to.have.string(normalize('tests/integration/test-files/sub1/a.js'));
        expect(message).to.have.string('2/0');
        expect(message).to.have.string(normalize('tests/integration/test-files/sub2/b.js'));
      });
    });

    describe('errors and warnings', () => {
      it("can find eslint's table format", () => {
        const { error, message } = esw(`-f table --no-ignore "${testFiles}"`);

        expect(error).to.be.true;
        expect(message).to.have.string('Line');
        expect(message).to.have.string('Column');
        expect(message).to.have.string('Type');
        expect(message).to.have.string('Message');
        expect(message).to.have.string('Rule ID');

        expect(message).to.have.string('5 Errors');
        expect(message).to.have.string('2 Warnings');
      });

      it('can find simple-detail', () => {
        const { error, message } = esw(`-f simple-detail --no-ignore "${testFiles}"`);

        const fileA = table([
          ['', '✖', '1:10', "'a' is defined but never used", 'no-unused-vars'],
          ['', '✖', '4:5', "'blah' is assigned a value but never used", 'no-unused-vars'],
          ['', '⚠', '5:5', "Unexpected dangling '_' in '_notPrivates'", 'no-underscore-dangle'],
          ['', '✖', '5:5', "'_notPrivates' is assigned a value but never used", 'no-unused-vars'],
        ]);
        const fileB = table([
          ['', '✖', '3:5', "'somethng' is assigned a value but never used", 'no-unused-vars'],
          ['', '⚠', '5:1', "Unexpected dangling '_' in '_reallyNotPrivate'", 'no-underscore-dangle'],
          ['', '✖', '5:10', "'_reallyNotPrivate' is defined but never used", 'no-unused-vars'],
        ]);

        expect(error).to.be.true;
        expect(message).to.have.string(normalize('tests/integration/test-files/sub1/a.js') + ' (3/1)');
        expect(message).to.have.string(fileA);
        expect(message).to.have.string(normalize('tests/integration/test-files/sub2/b.js') + ' (2/1)');
        expect(message).to.have.string(fileB);
        expect(message).to.have.string('✖ 5 errors ⚠ 2 warnings');
      });

      it('can find simple-success', () => {
        const { error, message } = esw(`-f simple-success --no-ignore "${testFiles}"`);

        expect(error).to.be.true;
        expect(message).to.have.string('3/1');
        expect(message).to.have.string('2/1');
      });

      it('can find simple', () => {
        const { error, message } = esw(`-f simple --no-ignore "${testFiles}"`);

        expect(error).to.be.true;
        expect(message).to.have.string('3/1');
        expect(message).to.have.string('2/1');
      });
    });

    describe('success no warnings', () => {
      it("can find eslint's table format", () => {
        const { error, message } = esw('-f table --quiet');

        expect(error).to.be.false;
        expect(message).to.have.string('0 Errors');
        expect(message).to.have.string('0 Warnings');
        expect(message).to.not.have.string('Line');
        expect(message).to.not.have.string('Column');
        expect(message).to.not.have.string('Type');
        expect(message).to.not.have.string('Message');
        expect(message).to.not.have.string('Rule ID');
      });

      it('can find simple-detail', () => {
        const { error, message } = esw('-f simple-detail --quiet');

        expect(error).to.be.false;
        expect(message).to.have.string('✓ Clean');
      });

      it('can find simple-success', () => {
        const { error, message } = esw('-f simple-success --quiet');

        expect(error).to.be.false;
        expect(message).to.eql('\n');
      });

      it('can find simple', () => {
        const { error, message } = esw('-f simple --quiet');

        expect(error).to.be.false;
        expect(message).to.eql('\n');
      });
    });
  });

  describe('linting', function() {
    it('finds 5 issues in test-files', function() {
      const output = esw(`--no-ignore "${testFiles}"`);
      expect(output.error).to.be.true;
      expect(output.message).to.have.string('5 errors');
    });

    it('finds 2 warnings', function() {
      const output = esw(`--no-ignore "${testFiles}"`);
      expect(output.error).to.be.true;
      expect(output.message).to.have.string('2 warnings');
    });

    it("doesn't find warnings with --quiet", function() {
      const output = esw('--quiet --no-ignore "' + testFiles + '"');
      expect(output.error).to.be.true;
      expect(output.message).to.not.have.string('2 warnings');
    });
  });

  describe('version', function() {
    it('prints out eslint-watch version with --esw-version', () => {
      const output = esw('--esw-version');
      expect(output.error).to.be.false;
      expect(output.message.trim()).to.equal(pkg.version);
    });
  });
});
