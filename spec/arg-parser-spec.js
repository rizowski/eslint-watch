'use strict';
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

var expect = chai.expect;

describe('arg-parser', function(){
  var parser, options;
  before(function(){
    parser = require('../src/arg-parser');
  });

  beforeEach(function(){
    options = {'_': []};
  });

  describe('watch', function(){
    it('parses for -w', function(){
      var args = ['node', 'some/long/path/to/prog', '-w'];
      var arr = parser.parse(args, options);
      expect(arr).to.not.contain('-w');
    });

    it('parses for --watch', function(){
      var watch = '--watch';
      var args = ['node', 'some/long/path/to/prog', watch];
      var arr = parser.parse(args, options);
      expect(arr).to.not.contain(watch);
    });
  });

  describe('path', function(){
    it('sets a default path if one isn\'t provided', function(){
      var arr = parser.parse([], options);
      expect(arr).to.contain('./');
    });

    it('doesn\'t set the default if a path is provided', function(){
      var path = 'something/short/';
      options._.push(path);
      var arr = parser.parse([], options);
      expect(arr).to.not.contain('./');
    });
  });

  describe('formatters', function(){
    var find = function(arr, what){
      var result = false;
      for(var i = 0; i < arr.length; i++){
        result = result || arr[i].indexOf(what) > -1;
      }
      return result;
    };
    var occurance = function(arr, what){
      var result = 0;
      for(var i = 0; i < arr.length; i++){
        if(arr[i].indexOf(what) > -1){
          result += 1;
        }
      }
      return result;
    };
    var pathStub;
    beforeEach(function(){
      var path = require('path');
      pathStub = sinon.stub(path, 'join', function(){
        return 'src\\' + arguments[1] + '\\' + arguments[2];
      });
    });

    afterEach(function(){
      pathStub.restore();
    });

    it('sets the full path to the formatters folder', function(){
      options.format = 'simple';
      var arr = parser.parse(['-f', 'simple'], options);
      var result = find(arr, 'src\\formatters\\simple');
      expect(result).to.be.true;
    });

    it('sets the default formatter to simple-detail using args', function(){
      options.format = 'simple-detail';
      var arr = parser.parse(['-f', 'simple-detail'], options);
      var result = find(arr, 'formatters\\simple-detail');
      expect(result).to.be.true;
    });

    it('handles passing in default', function(){
      options.format = 'simple-detail';
      var arr = parser.parse(['-f', 'simple-detail'], options);
      var result = occurance(arr, 'formatters\\simple-detail');
      expect(result).to.equal(1);
    });
  });
});
