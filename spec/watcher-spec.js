import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import proxy from 'proxyquire';

chai.use(sinonChai);
let expect = chai.expect;

describe('Watcher', () => {
  let watcher;
  let onSpy;
  let errorSpy;
  let watcherOptions;
  let on;
  let path;
  let isIgnored;
  let configForFileSpy;
  let paths;

  beforeEach(() => {
    onSpy = sinon.spy();
    errorSpy = sinon.spy();
    configForFileSpy = sinon.spy();
    path = '';
    paths = ['some/path', 'some/other/path.js'];
    isIgnored = false;
    let cliEngine = () => {
      return {
        options: {
          extensions: ['.js']
        },
        isPathIgnored: () => {
          return isIgnored;
        },
        getConfigForFile: configForFileSpy,
        executeOnFiles: () => {
          return {
            results: [{ errorCount: 0, warningCount: 0 }]
          };
        }
      };
    };
    on = (event, cllbk) => {
      onSpy(event);
      cllbk(path);
      return {
        on: errorSpy
      };
    };
    watcher = proxy('../src/watcher',{
      './log': () => {
        return {
          log: () => {},
          debug: () => {}
        };
      },
      'chokidar': {
        watch: (options) => {
          watcherOptions = options;
          return {
            on: on
          };
        },
      },
      'eslint': {
        CLIEngine: cliEngine
      },
      './formatters/simple-detail': () => {},
      './formatters/helpers/success': () => {}
    });
  });

  it('calls the on event', () => {
    watcher({ _: [] });
    expect(onSpy.called).to.be.true;
  });

  it('watches the directories under _ attribute', () => {
    let arr = ['hello'];
    watcher({ _: arr });
    expect(watcherOptions).to.equal(arr);
  });

  it('it calls the on changed event', () => {
    watcher({ _: [] });
    expect(onSpy).to.have.been.calledWith('change');
  });

  it('calls the getConfigForFile method if extension exists in path', () => {
    path = 'yup.js';
    watcher({ _: paths });
    expect(configForFileSpy).to.have.been.called;
  });

  it('does not call getConfigForFile if extensions do not exist in the path', () => {
    path = 'nope';
    paths = ['some/path.js'];
    watcher({ _: paths });
    expect(configForFileSpy).to.not.have.been.called;
  });

});
