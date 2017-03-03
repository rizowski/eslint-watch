let formatter = require('../../src/formatters/simple-detail');
let chalk = require('chalk');
let icons = require('../../src/formatters/helpers/characters');

describe('simple-detail', function(){
  let sandbox;
  let errorResult;
  let warningResult;
  let filePath;

  beforeEach(function (){
    sandbox = sinon.sandbox.create();
    let format = {
      open: '',
      close: '',
      closeRe: ''
    };
    filePath = '/some/file/path';
    sandbox.stub(chalk.styles, 'green', format);
    sandbox.stub(chalk.styles, 'white', format);
    sandbox.stub(chalk.styles, 'dim', format);
    sandbox.stub(chalk.styles, 'gray', format);
    sandbox.stub(chalk.styles, 'yellow', format);
    sandbox.stub(chalk.styles, 'red', format);
    sandbox.stub(chalk.styles, 'underline', format);
    errorResult = {
      errorCount: 1,
      warningCount: 0,
      messages: [{
        fatal: true,
        message: 'broken something or other',
        ruleId: 'broken-things'
      }],
      filePath: filePath
    };
    warningResult = {
      errorCount: 0,
      warningCount: 1,
      messages: [{
        fatal: false,
        line: 1,
        column: 2,
        message: 'you should do this',
        ruleId: 'advised'
      }],
      filePath: filePath
    };
  });

  afterEach(function(){
    sandbox.restore();
  });

  describe('clean', function(){
    // Possible this test might fail. haha oh well...
    // Works for now.
    it('prints out a checkmark with the date', function(){
      let time = new Date().toLocaleTimeString();
      let result = formatter([]);
      expect(result).to.equal(icons.check + ' Clean ' + '(' + time + ')');
    });
  });

  describe('errors', function(){
    // can break sometimes
    it('prints out errors if there are any', function(){
      let time = new Date().toLocaleTimeString();
      let result = formatter([errorResult]);
      expect(result).to.equal(filePath + ' (1/0)\n  ' + icons.x + '  0:0  broken something or other  broken-things\n\n' + icons.x + ' 1 error (' + time + ')\n');
    });

    it('prints out errors if there are multiple', function(){
      let result = formatter([errorResult, errorResult]);
      expect(result).to.includes('errors');
    });
  });

  describe('warnings', function(){
    // can break
    it('prints out any warnings if there are any', function(){
      let time = new Date().toLocaleTimeString();
      let result = formatter([warningResult]);
      expect(result).to.equal(filePath + ' (0/1)\n  ' + icons.ex + '  1:2  you should do this  advised\n\n' + icons.ex + ' 1 warning (' + time + ')\n');
    });

    it('prints out warnings if there are multiple', function(){
      let result = formatter([warningResult, warningResult]);
      expect(result).to.include('warnings');
    });
  });

  describe('errors/warnings', function(){
    it('prints out warnings and errors', function(){
      let result = formatter([errorResult, warningResult]);
      expect(result).to.include('1 error');
      expect(result).to.include('1 warning');
    });

    it('prints out both errors and warnings', function(){
      let result = formatter([errorResult, errorResult, warningResult, warningResult]);
      expect(result).to.include('2 warnings');
      expect(result).to.include('2 errors');
    });

    it('prints out both errors and warnings for one file', function(){
      let results = [{
        errorCount: 1,
        warningCount: 1,
        messages: [{
          fatal: false,
          line: 1,
          column: 2,
          message: 'you should do this',
          ruleId: 'advised'
        },
        {
          fatal: true,
          line: 3,
          column: 2,
          message: 'you should do this',
          ruleId: 'required'
        }],
        filePath: filePath
      }];
      let result = formatter(results);
      expect(result).to.include('(1/1)');
      expect(result).to.include('1 warning');
      expect(result).to.include('1 error');
      expect(result).to.include('required');
      expect(result).to.not.include('undefined');
    });
  });
});
