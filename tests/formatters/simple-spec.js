let formatter = require('../../src/formatters/simple');
let chalk = require('chalk');

describe('simple formatter', function () {
  let sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    let format = {
      open: '',
      close: '',
      closeRe: ''
    };
    sandbox.stub(chalk.styles, 'red', format);
    sandbox.stub(chalk.styles, 'yellow', format);
    sandbox.stub(chalk.styles, 'white', format);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('prints the error count', function () {
    let object = { errorCount: 4, warningCount: 0, filePath: '/some/file/path' };
    let result = formatter([object]);
    expect(result).to.equal('4/0 /some/file/path\n');
  });

  it('prints nothing if there are no errors or warnings', function () {
    let result = formatter([{ errorCount: 0, warningCount: 0 }]);
    expect(result).to.equal('');
  });
});
