const fs = require('fs');
const path = require('path');
const parser = require('../../../src/eslint/parser');

describe('unit: help-parser', () => {
  describe('parseHelp', () => {
    const title = 'title with options';
    const optionsTxt = 'Options:';
    const helpTxt = '--help      This has no alias or type';
    const cluck = '-c --cluck Boolean     Goes Cluck';
    const noAlias = '--see String     no alias';
    const noType = '-n --nope      no type to be found here';
    const noColor = '  --no-color                  Disable color in piped output';
    const doubleExample = '--color, --no-color       Enables or disables color piped output';
    let msg;

    beforeEach(() => {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n${cluck}\n${noAlias}\n${noType}\n`;
    });

    it('has an alias if one is provided', () => {
      const options = parser.parseHelp(msg);
      const option = options[1];
      expect(option.alias).toBe('c');
    });

    it('does not have an alias if not provided', () => {
      const options = parser.parseHelp(msg);
      const option = options[2];
      expect(option.alias).toBe(undefined);
    });

    it('has a type', () => {
      const options = parser.parseHelp(msg);
      const option = options[1];
      expect(option.type).toBe('Boolean');
    });

    it('has a full description', () => {
      const options = parser.parseHelp(msg);
      const option = options[1];
      expect(option.description).toBe('Goes Cluck');
    });

    it('filters out help', () => {
      const options = parser.parseHelp(msg);
      expect(options.some((o) => o.option === 'help')).toBe(false);
    });

    it('does not filter out format', () => {
      msg += '-f --format String     Stringify\n';
      const options = parser.parseHelp(msg);
      expect(options.some((o) => o.option === 'format')).toBe(true);
    });

    it("doesn't set an option as undefined", () => {
      const options = parser.parseHelp(msg);
      expect(options.filter((o) => !o.heading).every((o) => Boolean(o.option))).toBe(true);
    });

    it("doesn't set an alias as undefined", () => {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n${cluck}\n`;
      const options = parser.parseHelp(msg);
      expect(options.filter((o) => !o.heading).every((o) => Boolean(o.alias))).toBe(true);
    });

    it("doesn't set a type as undefined", () => {
      const options = parser.parseHelp(msg);
      expect(options.filter((o) => !o.heading).every((o) => Boolean(o.type))).toBe(true);
    });

    it("doesn't set a description as undefined", () => {
      const options = parser.parseHelp(msg);
      expect(options.filter((o) => !o.heading).every((o) => Boolean(o.description))).toBe(true);
    });

    it("sets the default to Boolean if type isn't provided", () => {
      const options = parser.parseHelp(msg);
      const option = options[3];
      expect(option.type).toBe('Boolean');
    });

    it("shouldn't throw exceptions", () => {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n\nHEADING:\n${cluck}\n`;
      expect(() => {
        parser.parseHelp(msg);
      }).not.toThrow();
    });

    it('filters out no from help options', () => {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n\nHEADING:\n${noColor}\n`;
      const options = parser.parseHelp(msg);
      const colorOption = options[2];
      expect(colorOption.option).toBe('color');
    });

    it('defaults no options to true', () => {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n\nHEADING:\n${noColor}\n`;
      const options = parser.parseHelp(msg);
      const colorOption = options[2];
      expect(colorOption.default).toBe('true');
    });

    it('can parse doubled option options', () => {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n\nHEADING:\n${doubleExample}\n`;
      const options = parser.parseHelp(msg);
      const colorOption = options[2];
      expect(colorOption).toEqual({
        option: 'color',
        type: 'Boolean',
        alias: 'no-color',
        description: 'Enables or disables color piped output',
      });
    });

    it('removes colons from headers', () => {
      msg = `${title}\n\nHEADING:\n${noColor}\n`;
      const options = parser.parseHelp(msg);
      expect(options[0].heading).not.toContain(':');
    });

    describe('path::String type format', () => {
      it('preserves path::String as the type (optionator handles it)', () => {
        msg = `${title}\n\nOptions:\n  --config path::String  Use this configuration\n`;
        const options = parser.parseHelp(msg);
        const configOpt = options.find((o) => o.option === 'config');
        expect(configOpt.type).toBe('path::String');
        expect(configOpt.description).toBe('Use this configuration');
      });

      it('parses aliased options with path::String type', () => {
        msg = `${title}\n\nOptions:\n  -c, --config path::String  Use this config\n`;
        const options = parser.parseHelp(msg);
        const configOpt = options.find((o) => o.option === 'config');
        expect(configOpt.type).toBe('path::String');
        expect(configOpt.alias).toBe('c');
      });
    });

    describe('ESLint v9 help format', () => {
      let v9Help;

      beforeAll(() => {
        v9Help = fs.readFileSync(path.join(__dirname, '../../mocks/eslint-help.text'), 'utf8');
      });

      it('parses v9 help without throwing', () => {
        expect(() => parser.parseHelp(v9Help)).not.toThrow();
      });

      it('does not include removed v8 options', () => {
        const options = parser.parseHelp(v9Help);
        const optionNames = options.filter((o) => !o.heading).map((o) => o.option);
        expect(optionNames).not.toContain('eslintrc');
        expect(optionNames).not.toContain('env');
        expect(optionNames).not.toContain('ext');
        expect(optionNames).not.toContain('resolve-plugins-relative-to');
        expect(optionNames).not.toContain('ignore-path');
        expect(optionNames).not.toContain('rulesdir');
      });

      it('includes new v9 options', () => {
        const options = parser.parseHelp(v9Help);
        const optionNames = options.filter((o) => !o.heading).map((o) => o.option);
        expect(optionNames).toContain('config-lookup');
        expect(optionNames).toContain('inspect-config');
        expect(optionNames).toContain('flag');
        expect(optionNames).toContain('warn-ignored');
        expect(optionNames).toContain('pass-on-no-patterns');
        expect(optionNames).toContain('stats');
      });

      it('preserves path::String types for optionator', () => {
        const options = parser.parseHelp(v9Help);
        const configOpt = options.find((o) => o.option === 'config');
        expect(configOpt.type).toBe('path::String');
        expect(configOpt.alias).toBe('c');
      });
    });
  });
});
