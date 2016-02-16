'use strict';
var chai = require('chai');
var expect = chai.expect;
var formatter = require('../../src/formatters/simple-detail');
var chalk = require('chalk');
var sinon = require('sinon');

describe('simple-detail', function(){
  var sandbox;
  var errorResult;
  var warningResult;
  var filePath;

  beforeEach(function (){
    sandbox = sinon.sandbox.create();
    var format = {
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
      var time = new Date().toLocaleTimeString();
      var result = formatter([]);
      expect(result).to.equal('✓ Clean ' + '(' + time + ')\n');
    });
  });

  describe('errors', function(){
    // can break sometimes
    it('prints out errors if there are any', function(){
      var time = new Date().toLocaleTimeString();
      var result = formatter([errorResult]);
      expect(result).to.equal(filePath + ' (1/0)\n  ✖  0:0  broken something or other  broken-things\n\n✖ 1 error (' + time + ')\n');
    });

    it('prints out errors if there are multiple', function(){
      var result = formatter([errorResult, errorResult]);
      expect(result).to.includes('errors');
    });
  });

  describe('warnings', function(){
    // can break
    it('prints out any warnings if there are any', function(){
      var time = new Date().toLocaleTimeString();
      var result = formatter([warningResult]);
      expect(result).to.equal(filePath + ' (0/1)\n  !  1:2  you should do this  advised\n\n! 1 warning (' + time + ')\n');
    });

    it('prints out warnings if there are multiple', function(){
      var result = formatter([warningResult, warningResult]);
      expect(result).to.include('warnings');
    });
  });

  describe('errors/warnings', function(){
    it('prints out warnings and errors', function(){
      var result = formatter([errorResult, warningResult]);
      expect(result).to.include('1 error');
      expect(result).to.include('1 warning');
    });

    it('prints out both errors and warnings', function(){
      var result = formatter([errorResult, errorResult, warningResult, warningResult]);
      expect(result).to.include('2 warnings');
      expect(result).to.include('2 errors');
    });

    it('prints out both errors and warnings for one file', function(){
      var results = [{
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
      var result = formatter(results);
      expect(result).to.include('(1/1)');
      expect(result).to.include('1 warning');
      expect(result).to.include('1 error');
      expect(result).to.include('required');
      expect(result).to.not.include('undefined');
    });
  });
});
