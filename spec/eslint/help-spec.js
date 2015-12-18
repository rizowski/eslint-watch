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

  it('has an alias if one is provided', function(done){
    return help()
      .then(function(options){
        var option = options[0];
        expect(option.alias).to.equal('c');
        done();
      });
  });

  it('does not have an alias if not provided', function(done){
    return help()
      .then(function(options){
        var option = options[1];
        expect(option.alias).to.equal(undefined);
        done();
      });
  });

  it('has a type', function(done){
    return help()
      .then(function(options){
        var option = options[0];
        expect(option.type).to.equal('Boolean');
        done();
      });
  });

  it('has a full description', function(done){
    return help()
      .then(function(options){
        var option = options[0];
        expect(option.description).to.equal('Goes Cluck');
        done();
      });
  });

  it('filters out help', function(done){
    return help()
      .then(function(options){
        _.each(options, function(option){
          assert.notEqual(option.option, 'help');
        });
        done();
      });
  });

  it('filters out format', function(done){
    msg += '-f --format String     Stringify' + '\n';
    return help()
      .then(function(options){
        _.each(options, function(option){
          assert.notEqual(option.option, 'format');
        });
        done();
      });
  });

  it("doesn't set an option as undefined", function(done){
    return help()
      .then(function(options){
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
    return help()
      .then(function(options){
        _.each(options, function(option){
          assert.ok(option.alias);
        });
        done();
      });
  });

  it("doesn't set a type as undefined", function(done){
    return help()
      .then(function(options){
        _.each(options, function(option){
          assert.ok(option.type);
        });
        done();
      });
  });

  it("doesn't set a description as undefined", function(done){
    return help()
      .then(function(options){
        _.each(options, function(option){
          assert.ok(option.description);
        });
        done();
      });
  });

  it("sets the default to Boolean if type isn't provided", function(done){
    return help()
      .then(function(options){
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
      return help()
        .then(function(options){
          var option = options[0];
          expect(option.type).to.equal('Boolean');
          done();
        });
    }).to.not.throw();
  });
});
