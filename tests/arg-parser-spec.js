describe('arg-parser', function () {
  var parser, options;
  before(function () {
    parser = require('../src/arg-parser');
  });

  beforeEach(function () {
    options = { '_': [] };
  });

  it('appends the path at the end of parsing', function(){
    var args = ['/bin/esw', 'cmd', 'cool'];
    var arr = parser.parse(args, options);
    expect(arr).to.eql(['cool', './']);
  });

  describe('defaults',function(){
    it('should remove the first argument',function(){
      var args = ['node', 'cmd', 'some/long/path'];
      var arr = parser.parse(args, options);
      expect(arr).to.not.include('node');
    });

    it('should remove the second command',function(){
      var args = ['/path/to/node','/bin/esw', '/something/else'];
      var arr = parser.parse(args, options);
      expect(arr).to.not.include('/bin/esw');
    });

    it('removes the first two arguments', function(){
      var args = ['/path/to/node', 'node', 'nodish'];
      var arr = parser.parse(args, options);
      expect(arr).to.eql(['nodish', './']);
    });
  });

  describe('watch', function(){
    it('parses for -w', function(){
      var args = ['node', 'some/long/path/to/prog', '-w'];
      var arr = parser.parse(args, options);
      expect(arr).to.not.contain('-w');
    });

    it('parses for --watch', function () {
      var watch = '--watch';
      var args = ['node', 'some/long/path/to/prog', watch];
      var arr = parser.parse(args, options);
      expect(arr).to.not.contain(watch);
    });
  });

  describe('path', function () {
    it('sets a default path if one isn\'t provided', function () {
      var arr = parser.parse([], options);
      expect(arr).to.contain('./');
    });

    it('doesn\'t set the default if a path is provided', function () {
      var path = 'something/short/';
      options._.push(path);
      var arr = parser.parse([], options);
      expect(arr).to.not.contain('./');
    });
  });

  describe('formatters', function () {
    var occurance = function (arr, what) {
      var result = 0;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].indexOf(what) > -1) {
          result += 1;
        }
      }
      return result;
    };
    var pathStub;
    beforeEach(function () {
      var path = require('path');
      pathStub = sinon.stub(path, 'join', function () {
        return 'src\\' + arguments[1] + '\\' + arguments[2];
      });
    });

    afterEach(function () {
      pathStub.restore();
    });

    it('sets the full path to the formatters folder', function () {
      options.format = 'simple';
      var arr = parser.parse(['node', 'cmd', '-f', 'simple'], options);
      expect(arr).to.include('src\\formatters\\simple');
    });

    it('sets the default formatter to simple-detail using args', function () {
      options.format = 'simple-detail';
      var arr = parser.parse(['node', 'cmd', '-f', 'simple-detail'], options);
      expect(arr).to.include('src\\formatters\\simple-detail');
    });

    it('sets the deafault formatter to simple-detail without args', function () {
      options.format = 'simple-detail';
      var arr = parser.parse(['node', 'cmd'], options);
      expect(arr).to.include('src\\formatters\\simple-detail');
    });

    it('handles passing in default', function () {
      options.format = 'simple-detail';
      var arr = parser.parse(['node', 'cmd', '-f', 'simple-detail'], options);
      var result = occurance(arr, 'formatters\\simple-detail');
      expect(result).to.equal(1);
    });
  });
});
