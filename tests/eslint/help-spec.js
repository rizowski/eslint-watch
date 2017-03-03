let proxy = require('proxyquire');
let _ = require('lodash');

describe('eslint/help', function(){
  let title = 'title with options';
  let optionsTxt = 'Options:';
  let helpTxt = '--help      This has no alias or type';
  let cluck = '-c --cluck Boolean     Goes Cluck';
  let noAlias = '--see String     no alias';
  let noType = '-n --nope      no type to be found here';
  let noColor = '  --no-color                  Disable color in piped output';
  let doubleExample = '--color, --no-color       Enables or disables color piped output';
  let msg;
  let help;

  before(function(){
    help = proxy('../../src/eslint/help', {
      './cli': function(){ return { code: 0, message: msg }; }
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
    const options = help();
    let option = options[0];
    expect(option.alias).to.equal('c');
  });

  it('does not have an alias if not provided', function(){
    const options = help();
    let option = options[1];
    expect(option.alias).to.equal(undefined);
  });

  it('has a type', function(){
    const options = help();
    let option = options[0];
    expect(option.type).to.equal('Boolean');
  });

  it('has a full description', function(){
    const options = help();
    let option = options[0];
    expect(option.description).to.equal('Goes Cluck');
  });

  it('filters out help', function(){
    const options = help();
    _.each(options, function(option){
      assert.notEqual(option.option, 'help');
    });
  });

  it('filters out format', function(){
    msg += '-f --format String     Stringify' + '\n';
    const options = help();
    _.each(options, function(option){
      assert.notEqual(option.option, 'format');
    });
  });

  it("doesn't set an option as undefined", function(){
    const options = help();
    _.each(options, function(option){
      assert.ok(option.option);
    });
  });

  it("doesn't set an alias as undefined", function(){
    msg = title + '\n' +
      '\n' +
      optionsTxt + '\n' +
      helpTxt + '\n' +
      cluck + '\n';
    const options = help();
    _.each(options, function(option){
      assert.ok(option.alias);
    });
  });

  it("doesn't set a type as undefined", function(){
    const options = help();
    _.each(options, function(option){
      assert.ok(option.type);
    });
  });

  it("doesn't set a description as undefined", function(){
    const options = help();
    _.each(options, function(option){
      assert.ok(option.description);
    });
  });

  it("sets the default to Boolean if type isn't provided", function(){
    const options = help();
    let option = options[2];
    expect(option.type).to.equal('Boolean');
  });

  it("shouldn't throw exceptions", function(){
    msg = title + '\n' +
      '\n' +
      optionsTxt + '\n' +
      helpTxt + '\n' +
      '\n' +
      'HEADING:\n'+
      cluck + '\n';
    expect(function (){
      help();
    }).to.not.throw();
  });

  it('filters out no from help options', function() {
    msg = title + '\n' +
      '\n' +
      optionsTxt + '\n' +
      helpTxt + '\n' +
      '\n' +
      'HEADING:\n'+
      noColor + '\n';
    const options = help();
    let colorOption = options[0];
    expect(colorOption.option).to.equal('color');
  });

  it('defaults no options to true', function(){
    msg = title + '\n' +
      '\n' +
      optionsTxt + '\n' +
      helpTxt + '\n' +
      '\n' +
      'HEADING:\n'+
      noColor + '\n';
    const options = help();
    let colorOption = options[0];
    expect(colorOption.default).to.equal('true');
  });

  it('can parse doubled option options', function(){
    msg = title + '\n' +
      '\n' +
      optionsTxt + '\n' +
      helpTxt + '\n' +
      '\n' +
      'HEADING:\n'+
      doubleExample + '\n';
    const options = help();
    let colorOption = options[0];
    expect(colorOption).to.eql({
      option: 'color',
      type: 'Boolean',
      alias: 'no-color',
      description: 'Enables or disables color piped output'
    });
  });
});
