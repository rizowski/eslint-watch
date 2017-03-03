let proxy = require('proxyquire');

describe('Watcher', function () {
  let watcher;
  let onSpy;
  let errorSpy;
  let watcherOptions;
  let on;
  let path;
  let isIgnored;

  beforeEach(function(){
    onSpy = sinon.spy();
    errorSpy = sinon.spy();
    path = '';
    isIgnored = false;
    let cliEngine = function(){
      return {
        options: {
          extensions: ['.js']
        },
        isPathIgnored: function() {
          return isIgnored;
        },
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
      './logger': function(){
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
    watcher({ _: [], format: 'simple-detail' });
    expect(onSpy.called).to.be.true;
  });

  it('watches the directories under _ attribute', function() {
    let arr = ['hello'];
    watcher({ _: arr, format: 'simple-detail' });
    expect(watcherOptions).to.equal(arr);
  });

  it('calls the on changed event', function() {
    watcher({ _: [], format: 'simple-detail' });
    expect(onSpy).to.have.been.calledWith('change');
  });
});
