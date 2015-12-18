import chai from 'chai';
import sinonChai from 'sinon-chai';
import path from 'path';

chai.use(sinonChai);
let expect = chai.expect;

describe('arg-parser', () => {
  let parser, options;
  before(() => {
    parser = require('../src/arg-parser');
  });

  beforeEach(() => {
    options = { '_': [] };
  });

  it('appends the path at the end of parsing', () => {
    let args = ['cool'];
    let arr = parser.parse(args, options);
    expect(arr).to.eql(['cool', './']);
  });

  describe('defaults',() => {
    it('should remove iojs',() => {
      let args = ['/some/path/to/iojs', 'some/long/path'];
      let arr = parser.parse(args, options);
      expect(arr).to.eql(['some/long/path', './']);
    });

    it('should remove node', () => {
      let args = ['node', 'some/long/path'];
      let arr = parser.parse(args, options);
      expect(arr).to.eql(['some/long/path', './']);
    });

    it('should remove esw',() => {
      let args = ['bla','/bin/esw', '/something/else'];
      let arr = parser.parse(args, options);
      expect(arr).to.eql(['bla', '/something/else', './']);
    });

    it('removes node with a path', () => {
      let args = ['/bla/path/to/node', 'node', 'nodish'];
      let arr = parser.parse(args, options);
      expect(arr).to.eql(['nodish', './']);
    });
  });

  describe('watch', () => {
    it('parses for -w', () => {
      let args = ['node', 'some/long/path/to/prog', '-w'];
      let arr = parser.parse(args, options);
      expect(arr).to.not.contain('-w');
    });

    it('parses for --watch', () => {
      let watch = '--watch';
      let args = ['node', 'some/long/path/to/prog', watch];
      let arr = parser.parse(args, options);
      expect(arr).to.not.contain(watch);
    });
  });

  describe('path', () => {
    it('sets a default path if one isn\'t provided', () => {
      let arr = parser.parse([], options);
      expect(arr).to.contain('./');
    });

    it('doesn\'t set the default if a path is provided', () => {
      let path = 'something/short/';
      options._.push(path);
      let arr = parser.parse([], options);
      expect(arr).to.not.contain('./');
    });
  });

  describe('formatters', () => {
    let contains = (arr, what) => {
      let result = false;
      for (let i = 0; i < arr.length; i++) {
        result = result || arr[i].indexOf(what) > -1;
      }
      return result;
    };
    let occurance = (arr, what) => {
      let result = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].indexOf(what) > -1) {
          result += 1;
        }
      }
      return result;
    };
    let pathStub;
    beforeEach(() => {
      pathStub = path.join;
      path.join = function() {
        return `src\\${arguments[1]}\\${arguments[2]}`;
      };
    });

    afterEach(() => {
      path.join = pathStub;
    });

    it('sets the full path to the formatters folder', () => {
      options.format = 'simple';
      let arr = parser.parse(['-f', 'simple'], options);
      let result = contains(arr, 'src\\formatters\\simple');
      expect(result).to.be.true;
    });

    it('sets the default formatter to simple-detail using args', () => {
      options.format = 'simple-detail';
      let arr = parser.parse(['-f', 'simple-detail'], options);
      let result = contains(arr, 'formatters\\simple-detail');
      expect(result).to.be.true;
    });

    it('handles passing in default', () => {
      options.format = 'simple-detail';
      let arr = parser.parse(['-f', 'simple-detail'], options);
      let result = occurance(arr, 'formatters\\simple-detail');
      expect(result).to.equal(1);
    });
  });
});
