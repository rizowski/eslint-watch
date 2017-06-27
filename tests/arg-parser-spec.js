describe('arg-parser', function () {
  let parser, options;
  before(function () {
    parser = require('../src/arg-parser');
  });

  beforeEach(function () {
    options = { '_': [] };
  });

  it('appends the path at the end of parsing', function () {
    let args = ['/bin/esw', 'cmd', 'cool'];
    let arr = parser.parse(args, options);
    expect(arr).to.eql(['cool', './']);
  });

  describe('defaults',function () {
    it('should remove the first argument',function () {
      let args = ['node', 'cmd', 'some/long/path'];
      let arr = parser.parse(args, options);
      expect(arr).to.not.include('node');
    });

    it('should remove the second command',function () {
      let args = ['/path/to/node','/bin/esw', '/something/else'];
      let arr = parser.parse(args, options);
      expect(arr).to.not.include('/bin/esw');
    });

    it('removes the first two arguments', function () {
      let args = ['/path/to/node', 'node', 'nodish'];
      let arr = parser.parse(args, options);
      expect(arr).to.eql(['nodish', './']);
    });
  });

  describe('watch', function () {
    it('parses for -w', function () {
      let args = ['node', 'some/long/path/to/prog', '-w'];
      let arr = parser.parse(args, options);
      expect(arr).to.not.contain('-w');
    });

    it('parses for --watch', function () {
      let watch = '--watch';
      let args = ['node', 'some/long/path/to/prog', watch];
      let arr = parser.parse(args, options);
      expect(arr).to.not.contain(watch);
    });

    it('parses for --full-lint', function () {
      const lint = '--changed';
      const args = ['node', 'some/long/path', lint];
      const arr = parser.parse(args, options);
      expect(arr).to.not.contain(lint);
    });
  });

  describe('path', function () {
    it('sets a default path if one isn\'t provided', function () {
      let arr = parser.parse([], options);
      expect(arr).to.contain('./');
    });

    it('doesn\'t set the default if a path is provided', function () {
      let path = 'something/short/';
      options._.push(path);
      let arr = parser.parse([], options);
      expect(arr).to.not.contain('./');
    });
  });

  describe('formatters', function () {
    let occurance = function (arr, what) {
      let result = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].indexOf(what) > -1) {
          result += 1;
        }
      }
      return result;
    };
    let pathStub;
    beforeEach(function () {
      let path = require('path');
      pathStub = sinon.stub(path, 'join', function () {
        return 'src\\' + arguments[1] + '\\' + arguments[2];
      });
    });

    afterEach(function () {
      pathStub.restore();
    });

    it('sets the full path to the formatters folder', function () {
      options.format = 'simple';
      let arr = parser.parse(['node', 'cmd', '-f', 'simple'], options);
      expect(arr).to.include('src\\formatters\\simple');
    });

    it('sets the default formatter to simple-detail using args', function () {
      options.format = 'simple-detail';
      let arr = parser.parse(['node', 'cmd', '-f', 'simple-detail'], options);
      expect(arr).to.include('src\\formatters\\simple-detail');
    });

    it('sets the deafault formatter to simple-detail without args', function () {
      options.format = 'simple-detail';
      let arr = parser.parse(['node', 'cmd'], options);
      expect(arr).to.include('src\\formatters\\simple-detail');
    });

    it('handles passing in default', function () {
      options.format = 'simple-detail';
      let arr = parser.parse(['node', 'cmd', '-f', 'simple-detail'], options);
      let result = occurance(arr, 'formatters\\simple-detail');
      expect(result).to.equal(1);
    });
  });
});
