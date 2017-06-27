let formatter = require('../../../src/formatters/helpers/success');
let chalk = require('chalk');

describe('success-helper', function () {
  let sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    let format = {
      open: '',
      close: '',
      closeRe: ''
    };
    sandbox.stub(chalk.styles, 'green', format);
    sandbox.stub(chalk.styles, 'white', format);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('places a checkmark and the path', function () {
    let object = { filePath: '/some/file/path' };
    let result = formatter(object);
    expect(result).to.equal('✓ /some/file/path');
  });
});
