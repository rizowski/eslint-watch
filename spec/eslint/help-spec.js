'use strict';

var proxy = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var _ = require('lodash');

describe('eslint/help', function(){
  var cli = require('../../src/eslint/cli');
  var title = 'title with options';
  var optionsTxt = 'Options:';
  var helpTxt = '--help      This has no alias or type';
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
    help(function(options){
      var option = options[0];
      expect(option.alias).to.be.ok;
    });
  });

  it('does not have an alias if not provided', function(){
    msg = title + '\n' +
        '\n' +
        optionsTxt + '\n' +
        noAlias + '\n';
    help(function(options){
      var option = options[0];
      expect(option.alias).to.equal(undefined);
    });
  });

  it('has a type', function(){
    msg = title + '\n' +
        '\n' +
        optionsTxt + '\n' +
        cluck + '\n';
    help(function(options){
      var option = options[0];
      expect(option.type).to.be.ok;
    });
  });

  it('has a full description', function(){
    msg = title + '\n' +
        '\n' +
        optionsTxt + '\n' +
        cluck + '\n';
    help(function(options){
      var option = options[0];
      expect(option.description).to.equal('Goes Cluck');
    });
  });

  it('filters out help', function(){
    msg = title + '\n' +
        '\n' +
        optionsTxt + '\n' +
        helpTxt + '\n' +
        optionsTxt + '\n' +
        cluck + '\n';
    help(function(options){
      _.each(options, function(option){
        assert.notEqual(option.option, '--help');
      });
    });
  });

  it('filters out format', function(){
    msg = title + '\n' +
        '\n' +
        optionsTxt + '\n' +
        helpTxt + '\n' +
        optionsTxt + '\n' +
        '-f --format String     Stringify' + '\n' +
        cluck + '\n';
    help(function(options){
      _.each(options, function(option){
        assert.notEqual(option.option, '--format');
      });
    });
  });

  it("doesn't set an option as undefined", function(){
    msg = title + '\n' +
              '\n' +
         optionsTxt + '\n' +
         cluck + '\n' +
          '\n';
    help(function(options){
      _.each(options, function(option){
        assert.ok(option.option);
      });
    });
  });

  it("doesn't set an alias as undefined", function(){
    msg = title + '\n' +
              '\n' +
         optionsTxt + '\n' +
         cluck + '\n' +
          '\n';
    help(function(options){
      _.each(options, function(option){
        assert.ok(option.alias);
      });
    });
  });

  it("doesn't set a type as undefined", function(){
    msg = title + '\n' +
              '\n' +
        optionsTxt + '\n' +
        cluck + '\n' +
          '\n';
    help(function(options){
      _.each(options, function(option){
        assert.ok(option.type);
      });
    });
  });
  it("doesn't set a description as undefined", function(){
    msg = title + '\n' +
              '\n' +
        optionsTxt + '\n' +
         cluck + '\n' +
          '\n';
    help(function(options){
      _.each(options, function(option){
        assert.ok(option.description);
      });
    });
  });
});
