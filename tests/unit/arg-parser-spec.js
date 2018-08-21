import _ from 'lodash';
import parser from '../../src/args-parser';

describe('unit: arg-parser', () => {
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
      let option = options[0];
      expect(option.alias).to.equal('c');
    });

    it('does not have an alias if not provided', function() {
      const options = parser.parseHelp(msg);
      let option = options[1];
      expect(option.alias).to.equal(undefined);
    });

    it('has a type', function() {
      const options = parser.parseHelp(msg);
      let option = options[0];
      expect(option.type).to.equal('Boolean');
    });

    it('has a full description', function() {
      const options = parser.parseHelp(msg);
      let option = options[0];
      expect(option.description).to.equal('Goes Cluck');
    });

    it('filters out help', function() {
      const options = parser.parseHelp(msg);
      _.each(options, function(option) {
        assert.notEqual(option.option, 'help');
      });
    });

    it('filters out format', function() {
      msg += '-f --format String     Stringify' + '\n';
      const options = parser.parseHelp(msg);
      _.each(options, function(option) {
        assert.notEqual(option.option, 'format');
      });
    });

    it("doesn't set an option as undefined", function() {
      const options = parser.parseHelp(msg);
      _.each(options, function(option) {
        assert.ok(option.option);
      });
    });

    it("doesn't set an alias as undefined", function() {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n${cluck}\n`;
      const options = parser.parseHelp(msg);
      _.each(options, function(option) {
        assert.ok(option.alias);
      });
    });

    it("doesn't set a type as undefined", function() {
      const options = parser.parseHelp(msg);
      _.each(options, function(option) {
        assert.ok(option.type);
      });
    });

    it("doesn't set a description as undefined", function() {
      const options = parser.parseHelp(msg);
      _.each(options, function(option) {
        assert.ok(option.description);
      });
    });

    it("sets the default to Boolean if type isn't provided", function() {
      const options = parser.parseHelp(msg);
      let option = options[2];
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
      let colorOption = options[0];
      expect(colorOption.option).to.equal('color');
    });

    it('defaults no options to true', function() {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n\nHEADING:\n${noColor}\n`;
      const options = parser.parseHelp(msg);
      let colorOption = options[0];
      expect(colorOption.default).to.equal('true');
    });

    it('can parse doubled option options', function() {
      msg = `${title}\n\n${optionsTxt}\n${helpTxt}\n\nHEADING:\n${doubleExample}\n`;
      const options = parser.parseHelp(msg);
      let colorOption = options[0];
      expect(colorOption).to.eql({
        option: 'color',
        type: 'Boolean',
        alias: 'no-color',
        description: 'Enables or disables color piped output',
      });
    });
  });

  describe('parseInput', () => {
    let options;

    beforeEach(function() {
      options = { _: [] };
    });

    it('appends the path at the end of parsing', function() {
      let args = ['/bin/esw', 'cmd', 'cool'];
      let arr = parser.parseInput(args, options);
      expect(arr).to.eql(['cool', './']);
    });

    describe('defaults', function() {
      it('should remove the first argument', function() {
        let args = ['node', 'cmd', 'some/long/path'];
        let arr = parser.parseInput(args, options);
        expect(arr).to.not.include('node');
      });

      it('should remove the second command', function() {
        let args = ['/path/to/node', '/bin/esw', '/something/else'];
        let arr = parser.parseInput(args, options);
        expect(arr).to.not.include('/bin/esw');
      });

      it('removes the first two arguments', function() {
        let args = ['/path/to/node', 'node', 'nodish'];
        let arr = parser.parseInput(args, options);
        expect(arr).to.eql(['nodish', './']);
      });
    });

    describe('watch', function() {
      it('parses for -w', function() {
        let args = ['node', 'some/long/path/to/prog', '-w'];
        let arr = parser.parseInput(args, options);
        expect(arr).to.not.contain('-w');
      });

      it('parses for --watch', function() {
        let watch = '--watch';
        let args = ['node', 'some/long/path/to/prog', watch];
        let arr = parser.parseInput(args, options);
        expect(arr).to.not.contain(watch);
      });

      it('parses for --full-lint', function() {
        const lint = '--changed';
        const args = ['node', 'some/long/path', lint];
        const arr = parser.parseInput(args, options);
        expect(arr).to.not.contain(lint);
      });
    });

    describe('path', function() {
      it("sets a default path if one isn't provided", function() {
        let arr = parser.parseInput([], options);
        expect(arr).to.contain('./');
      });

      it("doesn't set the default if a path is provided", function() {
        let path = 'something/short/';
        options._.push(path);
        let arr = parser.parseInput([], options);
        expect(arr).to.not.contain('./');
      });
    });

    describe('formatters', function() {
      let occurance = function(arr, what) {
        let result = 0;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].indexOf(what) > -1) {
            result += 1;
          }
        }
        return result;
      };
      let pathStub;
      beforeEach(function() {
        let path = require('path');
        pathStub = sinon.stub(path, 'join').callsFake(function() {
          return `src\\${arguments[1]}\\${arguments[2]}`;
        });
      });

      afterEach(function() {
        pathStub.restore();
      });

      it('sets the full path to the formatters folder', function() {
        options.format = 'simple';
        let arr = parser.parseInput(['node', 'cmd', '-f', 'simple'], options);
        expect(arr).to.include('src\\formatters\\simple');
      });

      it('sets the default formatter to simple-detail using args', function() {
        options.format = 'simple-detail';
        let arr = parser.parseInput(['node', 'cmd', '-f', 'simple-detail'], options);
        expect(arr).to.include('src\\formatters\\simple-detail');
      });

      it('sets the deafault formatter to simple-detail without args', function() {
        options.format = 'simple-detail';
        let arr = parser.parseInput(['node', 'cmd'], options);
        expect(arr).to.include('src\\formatters\\simple-detail');
      });

      it('handles passing in default', function() {
        options.format = 'simple-detail';
        let arr = parser.parseInput(['node', 'cmd', '-f', 'simple-detail'], options);
        let result = occurance(arr, 'formatters\\simple-detail');
        expect(result).to.equal(1);
      });
    });
  });
});
