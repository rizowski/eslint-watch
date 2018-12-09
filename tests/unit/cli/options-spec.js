import path from 'path';
import options from '../../../src/cli/options';

describe('cli/options', () => {
  it('has a property that can get esw options', () => {
    expect(options.eswOptions).to.be.an('array');
  });

  describe('#createOptions', () => {
    it('returns an object with two properties', () => {
      const result = options.createOptions(options.eswOptions, []);

      expect(result)
        .to.be.an('object')
        .with.keys(['helpText', 'parse']);
    });

    it('returns help text', () => {
      const result = options.createOptions(options.eswOptions, []);

      expect(result.helpText).to.be.a('string');
      expect(result.helpText.replace(/\s+/g, ' ')).to.equal(
        `esw [options] [file.js ...] [dir ...]

        ESW Options:
          -h, --help     Show help
          -w, --watch    Enable file watch
          --changed      Enables single file linting while watch is enabled
          --clear        Clear terminal when running lint
          -v, --version  Prints Eslint-Watch Version
          --versions     Prints Eslint-Watch and Eslint Versions
          --watch-ignore RegExp  Regex string of folders to ignore when watching - default: /.git|node_modules|bower_components/`.replace(/\s+/g, ' ')
      );
    });

    it('merges options', () => {
      const result = options.createOptions(
        [{ option: 'watch', type: 'Boolean', description: 'watches' }],
        [{ option: 'help', type: 'Boolean', description: 'does the help' }]
      );

      expect(result.helpText.replace(/\s+/g, ' ')).to.equal('esw [options] [file.js ...] [dir ...] --watch watches --help does the help');
    });

    it('dedupes options', () => {
      const result = options.createOptions(
        [{ option: 'watch', type: 'Boolean', description: 'watches' }],
        [{ option: 'watch', type: 'Boolean', description: 'watches' }]
      );

      expect(result.helpText.replace(/\s+/g, ' ')).to.equal('esw [options] [file.js ...] [dir ...] --watch watches');
    });

    describe('#parse', () => {
      let testOps;

      before(() => {
        testOps = options.createOptions(options.eswOptions);
      });

      it('parses raw args into options', () => {
        const result = testOps.parse(['-h', '-w', '--changed', '--clear', '-v', '--versions', '--watch-ignore', '/node_modules|dist|build/']);

        expect(result).to.eql({
          help: true,
          watch: true,
          changed: true,
          clear: true,
          version: true,
          versions: true,
          watchIgnore: /node_modules|dist|build/,
          _: [path.resolve('./')],
        });
      });

      it('returns a default path if none are provided', () => {
        const result = testOps.parse([]);

        expect(result._).to.eql([path.resolve('.')]);
      });
    });
  });

  describe('#getCli', () => {
    it('returns an object with flags and dirs from a given optionator object', () => {
      const result = options.getCli({ test: true, _: ['./'] });

      expect(result).to.eql({ flags: ['--test'], dirs: ['./'] });
    });

    it('returns multiple dirs', () => {
      const result = options.getCli({ _: ['.', './'] });

      expect(result).to.eql({ flags: [], dirs: ['.', './'] });
    });

    it('returns multiple flags', () => {
      const result = options.getCli({ flag: false, string: 'sup' });

      expect(result).to.eql({ flags: ['--no-flag', '--string', 'sup'], dirs: [] });
    });

    it('sets false boolean flags with --no- prefix', () => {
      const result = options.getCli({ flag: false });

      expect(result.flags).to.eql(['--no-flag']);
    });

    it('sets true boolean flags to --flag-name', () => {
      const result = options.getCli({ flagName: true });

      expect(result.flags).to.eql(['--flag-name']);
    });

    it('does not include watch, version(s), or clear', () => {
      const result = options.getCli({ watch: true, version: true, versions: true, clear: true, changed: true, watchIgnore: true });

      expect(result.flags)
        .to.be.an('array')
        .and.to.have.length(0);
    });
  });
});
