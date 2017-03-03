let formatter = require('../../src/formatters/simple-success');
let chalk = require('chalk');

describe('simple-success', function(){
  let sandbox;
  beforeEach(function (){
    sandbox = sinon.sandbox.create();
    let format = {
      open: '',
      close: '',
      closeRe: ''
    };
    sandbox.stub(chalk.styles, 'green', format);
    sandbox.stub(chalk.styles, 'red', format);
    sandbox.stub(chalk.styles, 'yellow', format);
    sandbox.stub(chalk.styles, 'white', format);
  });

  afterEach(function(){
    sandbox.restore();
  });

  it('prints the success message', function(){
    let object = { errorCount: 0, warningCount: 0, filePath: '/some/file/path' };
    let result = formatter([object]);
    expect(result).to.equal('✓ /some/file/path\n');
  });

  it('prints the error message if there are errors', function(){
    let results = { errorCount: 2, warningCount: 0, filePath: '/some/file/path' };
    let result = formatter([results]);
    expect(result).to.equal('2/0 /some/file/path\n');
  });

  it('prints the warning message if there are warnings', function(){
    let results = { errorCount: 0, warningCount: 1, filePath: '/some/file/path' };
    let result = formatter([results]);
    expect(result).to.equal('0/1 /some/file/path\n');
  });

  it('prints the both messages if there are warnings and errors', function(){
    let results = { errorCount: 1, warningCount: 1, filePath: '/some/file/path' };
    let result = formatter([results]);
    expect(result).to.equal('1/1 /some/file/path\n');
  });
});
