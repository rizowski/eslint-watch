'use strict';
var formatter = require('../../../src/formatters/helpers/error-warning');
var chalk = require('chalk');

describe('error-warning-helper', function(){
  var sandbox;
  beforeEach(function (){
    sandbox = sinon.sandbox.create();
    var format = {
      open: '',
      close: '',
      closeRe: ''
    };
    sandbox.stub(chalk.styles, 'red', format);
    sandbox.stub(chalk.styles, 'yellow', format);
    sandbox.stub(chalk.styles, 'white', format);
  });

  afterEach(function(){
    sandbox.restore();
  });

  it('prints error count if errorCount exists', function(){
    var object = { errorCount: 4, warningCount: 0, filePath: '/some/file/path' };
    var result = formatter(object);
    expect(result).to.equal('4/0 /some/file/path');
  });

  it('prints warning count if warningCount exists', function(){
    var object = { errorCount: 0, warningCount: 4, filePath: '/some/file/path' };
    var result = formatter(object);
    expect(result).to.equal('0/4 /some/file/path');
  });

  it('prints just errors when there are messages', function(){
    var object = { messages: ['hello', 'two'], filePath: '/some/file/path' };
    var result = formatter(object);
    expect(result).to.equal('2 /some/file/path');
  });
});
