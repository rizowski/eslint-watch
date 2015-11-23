'use strict';
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

var expect = chai.expect;
var proxy = require('proxyquire');

describe('Watcher', function () {
  var watcher;
  var onSpy;
  var errorSpy;
  var watcherOptions;
  var on;
  var path;
  var isIgnored;
  var configForFileSpy;
  var paths;

  beforeEach(function(){
    onSpy = sinon.spy();
    errorSpy = sinon.spy();
    configForFileSpy = sinon.spy();
    path = '';
    paths = ['some/path', 'some/other/path.js'];
    isIgnored = false;
    var cliEngine = function(){
      return {
        options: {
          extensions: ['.js']
        },
        isPathIgnored: function() {
          return isIgnored;
        },
        getConfigForFile: configForFileSpy,
        executeOnFiles: function() {
          return {
            results: [{ errorCount: 0, warningCount: 0 }]
          };
        }
      };
    };
    on = function(event, cllbk){
      onSpy(event);
      cllbk(path);
      return {
        on: errorSpy
      };
    };
    watcher = proxy('../src/watcher',{
      './log': function(){
        return {
          log: function(){},
          debug: function(){}
        };
      },
      'chokidar': {
        watch: function(options){
          watcherOptions = options;
          return {
            on: on
          };
        },
      },
      'eslint': {
        CLIEngine: cliEngine
      },
      './formatters/simple-detail': function(){},
      './formatters/helpers/success': function(){}
    });
  });

  it('calls the on event', function(){
    watcher({ _: [] });
    expect(onSpy.called).to.be.true;
  });

  it('watches the directories under _ attribute', function() {
    var arr = ['hello'];
    watcher({ _: arr });
    expect(watcherOptions).to.equal(arr);
  });

  it('it calls the on changed event', function() {
    watcher({ _: [] });
    expect(onSpy).to.have.been.calledWith('change');
  });

  it('calls the getConfigForFile method if extension exists in path', function(){
    path = 'yup.js';
    watcher({ _: paths });
    expect(configForFileSpy).to.have.been.called;
  });

  it('does not call getConfigForFile if extensions do not exist in the path', function(){
    path = 'nope';
    paths = ['some/path.js'];
    watcher({ _: paths });
    expect(configForFileSpy).to.not.have.been.called;
  });

});
