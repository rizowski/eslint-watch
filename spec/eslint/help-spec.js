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
  var noColor = '  --no-color                  Disable color in piped output';
  var doubleExample = '--color, --no-color       Enables or disables color piped output';
  var msg;
  var help;

  before(function(){
    help = proxy('../../src/eslint/help', {
      './cli': function(args, options, childOptions, callback){
        callback({
          errored: false,
          output: msg
        });
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

  it('has an alias if one is provided', function(done){
    help(function(options){
      var option = options[0];
      expect(option.alias).to.equal('c');
      done();
    });
  });

  it('does not have an alias if not provided', function(done){
    help(function(options){
      var option = options[1];
      expect(option.alias).to.equal(undefined);
      done();
    });
  });

  it('has a type', function(done){
    help(function(options){
      var option = options[0];
      expect(option.type).to.equal('Boolean');
      done();
    });
  });

  it('has a full description', function(done){
    help(function(options){
      var option = options[0];
      expect(option.description).to.equal('Goes Cluck');
      done();
    });
  });

  it('filters out help', function(done){
    help(function(options){
      _.each(options, function(option){
        assert.notEqual(option.option, 'help');
      });
      done();
    });
  });

  it('filters out format', function(done){
        msg += '-f --format String     Stringify' + '\n';
    help(function(options){
      _.each(options, function(option){
        assert.notEqual(option.option, 'format');
      });
      done();
    });
  });

  it("doesn't set an option as undefined", function(done){
    help(function(options){
      _.each(options, function(option){
        assert.ok(option.option);
      });
      done();
    });
  });

  it("doesn't set an alias as undefined", function(done){
     msg = title + '\n' +
        '\n' +
        optionsTxt + '\n' +
        helpTxt + '\n' +
        cluck + '\n';
    help(function(options){
      _.each(options, function(option){
        assert.ok(option.alias);
      });
      done();
    });
  });

  it("doesn't set a type as undefined", function(done){
    help(function(options){
      _.each(options, function(option){
        assert.ok(option.type);
      });
      done();
    });
  });

  it("doesn't set a description as undefined", function(done){
    help(function(options){
      _.each(options, function(option){
        assert.ok(option.description);
      });
      done();
    });
  });

  it("sets the default to Boolean if type isn't provided", function(done){
    help(function(options){
      var option = options[2];
      expect(option.type).to.equal('Boolean');
      done();
    });
  });

  it("shouldn't throw exceptions", function(done){
    msg = title + '\n' +
       '\n' +
       optionsTxt + '\n' +
       helpTxt + '\n' +
       '\n' +
       'HEADING:\n'+
       cluck + '\n';
    expect(function(){
      help(function(options){
        var option = options[0];
        expect(option.type).to.equal('Boolean');
        done();
      });
    }).to.not.throw();
  });

  it('filters out no from help options', function(done) {
    msg = title + '\n' +
       '\n' +
       optionsTxt + '\n' +
       helpTxt + '\n' +
       '\n' +
       'HEADING:\n'+
       noColor + '\n';
    help(function(options) {
      var colorOption = options[0];
      expect(colorOption.option).to.equal('color');
      done();
    });
  });

  it('defaults no options to true', function(done){
    msg = title + '\n' +
       '\n' +
       optionsTxt + '\n' +
       helpTxt + '\n' +
       '\n' +
       'HEADING:\n'+
       noColor + '\n';

       help(function(options){
        var colorOption = options[0];
        expect(colorOption.default).to.equal('true');
        done();
       });
  });

  it('can parse doubled option options', function(done){
    msg = title + '\n' +
       '\n' +
       optionsTxt + '\n' +
       helpTxt + '\n' +
       '\n' +
       'HEADING:\n'+
       doubleExample + '\n';
       help(function(options){
         var colorOption = options[0];
         expect(colorOption).to.eql({
           option: 'color',
           type: 'Boolean',
           alias: 'no-color',
           description: 'Enables or disables color piped output'
         });
         done();
       });
  });
});
