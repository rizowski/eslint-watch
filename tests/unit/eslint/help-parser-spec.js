import parser from '../../../src/eslint/parser';

describe('unit: help-parser', () => {
  describe('parseHelp', () => {
    let title = 'title with options';
    let optionsTxt = 'Options:';
    let helpTxt = '--help      This has no alias or type';
    let cluck = '-c --cluck Boolean     Goes Cluck';
    let noAlias = '--see String     no alias';
    let noType = '-n --nope      no type to be found here';
    let noColor = '  --no-color                  Disable color in piped output';
    let doubleExample = '--color, --no-color       Enables or disables color piped output';
    let msg;

    beforeEach(function() {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n${cluck}\n${noAlias}\n${noType}\n`;
    });

    it('has an alias if one is provided', function() {
      const options = parser.parseHelp(msg);
      let option = options[1];
      expect(option.alias).to.equal('c');
    });

    it('does not have an alias if not provided', function() {
      const options = parser.parseHelp(msg);
      let option = options[2];
      expect(option.alias).to.equal(undefined);
    });

    it('has a type', function() {
      const options = parser.parseHelp(msg);
      let option = options[1];
      expect(option.type).to.equal('Boolean');
    });

    it('has a full description', function() {
      const options = parser.parseHelp(msg);
      let option = options[1];
      expect(option.description).to.equal('Goes Cluck');
    });

    it('filters out help', function() {
      const options = parser.parseHelp(msg);
      expect(options.some((o) => o.option === 'help')).to.equal(false);
    });

    it('does not filter out format', function() {
      msg += '-f --format String     Stringify' + '\n';
      const options = parser.parseHelp(msg);
      expect(options.some((o) => o.option === 'format')).to.equal(true);
    });

    it("doesn't set an option as undefined", function() {
      const options = parser.parseHelp(msg);
      expect(options.filter((o) => !o.heading).every((o) => !!o.option)).to.equal(true);
    });

    it("doesn't set an alias as undefined", function() {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n${cluck}\n`;
      const options = parser.parseHelp(msg);
      expect(options.filter((o) => !o.heading).every((o) => !!o.alias)).to.equal(true);
    });

    it("doesn't set a type as undefined", function() {
      const options = parser.parseHelp(msg);
      expect(options.filter((o) => !o.heading).every((o) => !!o.type)).to.equal(true);
    });

    it("doesn't set a description as undefined", function() {
      const options = parser.parseHelp(msg);
      expect(options.filter((o) => !o.heading).every((o) => !!o.description)).to.equal(true);
    });

    it("sets the default to Boolean if type isn't provided", function() {
      const options = parser.parseHelp(msg);
      let option = options[3];
      expect(option.type).to.equal('Boolean');
    });

    it("shouldn't throw exceptions", function() {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n\nHEADING:\n${cluck}\n`;
      expect(function() {
        parser.parseHelp(msg);
      }).to.not.throw();
    });

    it('filters out no from help options', function() {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n\nHEADING:\n${noColor}\n`;
      const options = parser.parseHelp(msg);
      let colorOption = options[2];
      expect(colorOption.option).to.equal('color');
    });

    it('defaults no options to true', function() {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n\nHEADING:\n${noColor}\n`;
      const options = parser.parseHelp(msg);
      let colorOption = options[2];
      expect(colorOption.default).to.equal('true');
    });

    it('can parse doubled option options', function() {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n\nHEADING:\n${doubleExample}\n`;
      const options = parser.parseHelp(msg);
      let colorOption = options[2];
      expect(colorOption).to.eql({
        option: 'color',
        type: 'Boolean',
        alias: 'no-color',
        description: 'Enables or disables color piped output',
      });
    });
  });
});
