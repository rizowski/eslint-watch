'use strict';

var proxy = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var _ = require('lodash');

describe('eslint/help', function(){
  var title = 'title with options';
  var optionsTxt = 'Options:';
  var helpTxt = '--help      This has no alias or type';
  var cluck = '-c --cluck Boolean     Goes Cluck';
  var noAlias = '--see String     no alias';
  var noType = '-n --nope      no type to be found here';
  var msg;
  var help;

  before(function(){
    help = proxy('../../src/eslint/help', {
      './cli': function(){
        return {
          stdout: {
            on: function(name, callback){
              callback(msg);
            }
          }
        };
      }
    });
  });

  beforeEach(function(){
    msg = title + '\n' +
        '\n' +
        optionsTxt + '\n' +
        helpTxt + '\n' +
        cluck + '\n' +
        noAlias + '\n' +
        noType + '\n';
  });

  it('has an alias if one is provided', function(){
    help(function(options){
      var option = options[0];
      expect(option.alias).to.equal('c');
    });
  });

  it('does not have an alias if not provided', function(){
    help(function(options){
      var option = options[1];
      expect(option.alias).to.equal(undefined);
    });
  });

  it('has a type', function(){
    help(function(options){
      var option = options[0];
      expect(option.type).to.equal('Boolean');
    });
  });

  it('has a full description', function(){
    help(function(options){
      var option = options[0];
      expect(option.description).to.equal('Goes Cluck');
    });
  });

  it('filters out help', function(){
    help(function(options){
      _.each(options, function(option){
        assert.notEqual(option.option, 'help');
      });
    });
  });

  it('filters out format', function(){
        msg += '-f --format String     Stringify' + '\n';
    help(function(options){
      _.each(options, function(option){
        assert.notEqual(option.option, 'format');
      });
    });
  });

  it("doesn't set an option as undefined", function(){
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
        helpTxt + '\n' +
        cluck + '\n';
    help(function(options){
      _.each(options, function(option){
        assert.ok(option.alias);
      });
    });
  });

  it("doesn't set a type as undefined", function(){
    help(function(options){
      _.each(options, function(option){
        assert.ok(option.type);
      });
    });
  });
  it("doesn't set a description as undefined", function(){
    help(function(options){
      _.each(options, function(option){
        assert.ok(option.description);
      });
    });
  });

  it("sets the default to Boolean if type isn't provided", function(){
    help(function(options){
      var option = options[2];
      expect(option.type).to.equal('Boolean');
    });
  });

  it('clears headings', function(){
    msg = title + '\n' +
       '\n' +
       optionsTxt + '\n' +
       helpTxt + '\n' +
       '\n' +
       'HEADING:\n'+
       cluck + '\n';
    expect(function(){
      help(function(options){
        var option = options[2];
        expect(option.type).to.equal('Boolean');
      });
    }).to.not.throw();
  });
});
