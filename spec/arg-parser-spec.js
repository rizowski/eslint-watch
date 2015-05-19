'use-strict';
var chai = require('chai');
var expect = chai.expect;

describe('arg-parser', function(){
  var parser;
  before(function(){
    parser = require('../src/arg-parser');
  });
  
  describe('watch', function(){
    it('parses for -w', function(){
      var args = ['node', 'some/long/path/to/prog', '-w'];
      var options = {
        '_': 'path'
      };
      var arr = parser.parse(args, options);
      expect(arr).to.not.contain('-w');
    });

    it('parses for --watch', function(){
      var watch = '--watch';
      var args = ['node', 'some/long/path/to/prog', watch];
      var options = {
        '_': 'path'
      };
      var arr = parser.parse(args, options);
      expect(arr).to.not.contain(watch);
    });
  });
  
  describe('path', function(){
    it('sets a default path if one isn\'t provided', function(){
      var options = {
        '_': []
      };
      var arr = parser.parse([], options);
      expect(arr).to.contain('./');
    });
  });

});