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
      expect(option.alias).to.equal('c');
    });

    it('does not have an alias if not provided', () => {
      const options = parser.parseHelp(msg);
      const option = options[2];
      expect(option.alias).to.equal(undefined);
    });

    it('has a type', () => {
      const options = parser.parseHelp(msg);
      const option = options[1];
      expect(option.type).to.equal('Boolean');
    });

    it('has a full description', () => {
      const options = parser.parseHelp(msg);
      const option = options[1];
      expect(option.description).to.equal('Goes Cluck');
    });

    it('filters out help', () => {
      const options = parser.parseHelp(msg);
      expect(options.some((o) => o.option === 'help')).to.equal(false);
    });

    it('does not filter out format', () => {
      msg += '-f --format String     Stringify\n';
      const options = parser.parseHelp(msg);
      expect(options.some((o) => o.option === 'format')).to.equal(true);
    });

    it("doesn't set an option as undefined", () => {
      const options = parser.parseHelp(msg);
      expect(options.filter((o) => !o.heading).every((o) => Boolean(o.option))).to.equal(true);
    });

    it("doesn't set an alias as undefined", () => {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n${cluck}\n`;
      const options = parser.parseHelp(msg);
      expect(options.filter((o) => !o.heading).every((o) => Boolean(o.alias))).to.equal(true);
    });

    it("doesn't set a type as undefined", () => {
      const options = parser.parseHelp(msg);
      expect(options.filter((o) => !o.heading).every((o) => Boolean(o.type))).to.equal(true);
    });

    it("doesn't set a description as undefined", () => {
      const options = parser.parseHelp(msg);
      expect(options.filter((o) => !o.heading).every((o) => Boolean(o.description))).to.equal(true);
    });

    it("sets the default to Boolean if type isn't provided", () => {
      const options = parser.parseHelp(msg);
      const option = options[3];
      expect(option.type).to.equal('Boolean');
    });

    it("shouldn't throw exceptions", () => {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n\nHEADING:\n${cluck}\n`;
      expect(() => {
        parser.parseHelp(msg);
      }).to.not.throw();
    });

    it('filters out no from help options', () => {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n\nHEADING:\n${noColor}\n`;
      const options = parser.parseHelp(msg);
      const colorOption = options[2];
      expect(colorOption.option).to.equal('color');
    });

    it('defaults no options to true', () => {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n\nHEADING:\n${noColor}\n`;
      const options = parser.parseHelp(msg);
      const colorOption = options[2];
      expect(colorOption.default).to.equal('true');
    });

    it('can parse doubled option options', () => {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n\nHEADING:\n${doubleExample}\n`;
      const options = parser.parseHelp(msg);
      const colorOption = options[2];
      expect(colorOption).to.eql({
        option: 'color',
        type: 'Boolean',
        alias: 'no-color',
        description: 'Enables or disables color piped output',
      });
    });

    it('removes colons from headers', () => {
      msg = `${title}\n\nHEADING:\n${noColor}\n`;
      const options = parser.parseHelp(msg);
      expect(options[0].heading).to.not.include(':');
    });
  });
});
