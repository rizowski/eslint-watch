'use strict';
var chai = require('chai');
var expect = chai.expect;
var child = require('child_process');
var path = require('path');

var eswPath = path.resolve(__dirname, '../../bin/esw');
var testFiles = path.resolve(__dirname, 'test-files');

describe('integration', function(){
  var esw;
  before(function(){
    esw = function(cmd){
      var result = {};
      try{
        result.message = child.execSync('node ' + eswPath + ' ' + cmd).toString();
        result.error = false;
      } catch(e){
        result.error = true;
        result.message = e.stdout.toString();
        result.cmd = e.cmd;
      }
      return result;
    };
  });

  describe('general', function(){
    it('reports any kind of help information', function(){
      var output = esw('--help');
      expect(output.error).to.be.false;
      expect(output.message).to.have.string('esw [options]');
    });

    it("cache command doesn't show help", function(){
      var output = esw('--cache --cache-location node_modules/.cache/esw');
      expect(output.error).to.be.false;
      expect(output.message).to.not.have.string('Options');
    });
  });

  describe('help', function(){
    it('has -w and --watch', function() {
      var output = esw('--help');
      expect(output.error).to.be.false;
      expect(output.message).to.have.string('-w');
      expect(output.message).to.have.string('--watch');
    });

    it('has simple-detail as default format', function(){
     var output = esw('--help');
     expect(output.error).to.be.false;
     expect(output.message).to.have.string('default: simple-detail');
    });
  });

  describe('watching', function(){
    beforeEach(function(){

    });

    afterEach(function(){

    });
  });

  describe('linting', function(){
    it('finds 5 issues in test-files', function(){
      var output = esw(testFiles);
      expect(output.error).to.be.true;
      expect(output.message).to.have.string('7 errors');
    });

    it('finds 2 warnings', function(){
      var output = esw(testFiles);
      expect(output.error).to.be.true;
      expect(output.message).to.have.string('2 warnings');
    });

    it("doesn't find warnings with --quiet", function(){
      var output = esw('--quiet ' + testFiles);
      expect(output.error).to.be.true;
      expect(output.message).to.not.have.string('2 warnings');
    });
  });
});
