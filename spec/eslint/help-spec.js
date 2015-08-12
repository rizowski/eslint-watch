'use strict';

var proxy = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');

describe('eslint/help', function(){
  var cli = require('../../src/eslint/cli');
  var title = 'title with options';
  var optionsTxt = 'Options:';
  var helpTxt = '--help      This has no alias';
  var cluck = '-c --cluck Boolean     Goes Cluck';
  var noAlias = '--see String     no alias';
  var msg;
  var help;
  var options = {
    generateHelp: function(){}
  };

  before(function(){
    help = proxy('../../src/eslint/help', {
      './cli': function(){
        return {
          stdout: {
            on: function(name, callback){
              callback(msg);
            }
          }
        }
      }
    });
  });

  beforeEach(function(){
    msg = '';
  })

  it('has an alias if one is provided', function(){
    msg = title + '\n' +
        '\n' +
        optionsTxt + '\n' +
        cluck + '\n';
    help(options, function(options){
      var option = options[0];
      expect(option.alias).to.be.ok;
    });
  });

  it('does not have an alias if not provided', function(){
    msg = title + '\n' +
        '\n' +
        optionsTxt + '\n' +
        noAlias + '\n';
    help(options, function(options){
      var option = options[0];
      expect(option.alias).to.equal(undefined);
    });
  });

  it('has a type', function(){
    msg = title + '\n' +
        '\n' +
        optionsTxt + '\n' +
        cluck + '\n';
    help(options, function(options){
      var option = options[0];
      expect(option.type).to.be.ok;
    });
  });

  it('has a full description', function(){
    msg = title + '\n' +
        '\n' +
        optionsTxt + '\n' +
        cluck + '\n';
    help(options, function(options){
      var option = options[0];
      expect(option.description).to.equal('Goes Cluck');
    });
  });

  it('filters out help', function(){
    msg = title + '\n' +
        helpTxt + '\n' +
        optionsTxt + '\n' +
        cluck + '\n';
    help(options, function(options){
      var result = _.find(options, function(option){
        return option.option === '--help';
      });
      expect(result).to.equal(undefined);
    });
  });

  it("doesn't parse undefined");
});
