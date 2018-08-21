// import proxy from 'proxyquire';

// describe('Watcher', function() {
//   let watcher;
//   let onSpy;
//   let errorSpy;
//   let watcherOptions;
//   let on;
//   let path;
//   let isIgnored;
//   let formatterName;
//   let sandbox;
//   let executeOnFilesSpy;

//   beforeEach(function() {
//     sandbox = sinon.createSandbox();
//     onSpy = sandbox.spy();
//     errorSpy = sandbox.spy();
//     executeOnFilesSpy = sandbox.spy();
//     path = '';
//     isIgnored = false;
//     const cliEngine = function() {
//       return {
//         options: {
//           extensions: ['.js'],
//         },
//         isPathIgnored: function() {
//           return isIgnored;
//         },
//         executeOnFiles: function(args) {
//           executeOnFilesSpy(...args);
//           return {
//             results: [{ errorCount: 0, warningCount: 0 }],
//           };
//         },
//         getFormatter(name) {
//           formatterName = name;
//           return () => {};
//         },
//       };
//     };
//     on = function(event, cllbk) {
//       onSpy(event);
//       cllbk(path);
//       return {
//         on: errorSpy,
//       };
//     };
//     watcher = proxy('../../src/watcher', {
//       './logger': function() {
//         return {
//           log: function() {},
//           debug: function() {},
//         };
//       },
//       chokidar: {
//         watch: function(options) {
//           watcherOptions = options;
//           return { on };
//         },
//       },
//       eslint: {
//         CLIEngine: cliEngine,
//       },
//       './formatters/simple-detail': function() {},
//       './formatters/helpers/success': function() {},
//       './settings': { cliOptions: {} },
//     });
//   });

//   afterEach(() => {
//     formatterName = null;
//   });

//   after(() => {
//     sandbox.restore();
//   });

//   it('calls the on event', function() {
//     watcher({ _: [], format: 'simple-detail' });
//     expect(onSpy.called).to.be.true;
//   });

//   it('watches the directories under _ attribute', function() {
//     let arr = ['hello'];
//     watcher({ _: arr, format: 'simple-detail' });
//     expect(watcherOptions).to.equal(arr);
//   });

//   it('calls the on changed event', function() {
//     watcher({ _: [], format: 'simple-detail' });
//     expect(onSpy).to.have.been.calledWith('change');
//   });

//   it('can use the built in table format without erroring', () => {
//     watcher({ _: [], format: 'table' });

//     expect(formatterName).to.equal('table');
//   });

//   it('can load simple formatters without erroring', () => {
//     // TODO: not sure how we can check this...
//     watcher({ _: [], format: 'simple-detail' });
//   });

//   describe('given a list of file extensions extensions', () => {
//     let options;

//     beforeEach(() => {
//       options = {
//         watch: true,
//         ext: ['js', 'jsx'],
//         format: 'simple-detail',
//         eslintrc: true,
//         ignore: true,
//         inlineConfig: true,
//         _: ['src'],
//       };
//     });

//     it('can lint', () => {
//       path = 'sample/thing.jsx';
//       watcher(options);
//       expect(onSpy.called).to.equal(true, 'OnSpy was not called');
//       expect(executeOnFilesSpy.called).to.equal(true, 'ExecuteOnFiles was not called');

//       path = 'sample/thing.js';
//       watcher(options);
//       expect(onSpy.called).to.equal(true, 'OnSpy was not called');
//       expect(executeOnFilesSpy.called).to.equal(true, 'ExecuteOnFiles was not called');
//     });
//   });
// });
