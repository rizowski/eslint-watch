var formatter = require('../../../src/formatters/helpers/success');
var chalk = require('chalk');

describe('success-helper', function(){
  var sandbox;
  beforeEach(function (){
    sandbox = sinon.sandbox.create();
    var format = {
      open: '',
      close: '',
      closeRe: ''
    };
    sandbox.stub(chalk.styles, 'green', format);
    sandbox.stub(chalk.styles, 'white', format);
  });

  afterEach(function(){
    sandbox.restore();
  });

  it('places a checkmark and the path', function(){
    var object = { filePath: '/some/file/path' };
    var result = formatter(object);
    expect(result).to.equal('✓ /some/file/path');
  });
});
