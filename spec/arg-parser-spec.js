'use strict';
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

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

  describe('foramtters', function(){
    it('sets the full path to the formatters folder', function(){
      options.format = 'simple';
      var arr = parser.parse(['-f', 'simple'], options);
      for(var i = 0; i < arr.length; i++){
        if(arr[i].indexOf('formatters\\') > -1)
        {
          assert(true);
        }
      }
    });
  });

});
