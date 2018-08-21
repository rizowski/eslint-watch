// import formatter from '../../../src/formatters/simple-detail';
// import icons from '../../../src/formatters/helpers/characters';
// import strip from 'strip-ansi';

// describe('simple-detail', function() {
//   let errorResult;
//   let warningResult;
//   let filePath;

//   beforeEach(function() {
//     filePath = '/some/file/path';
//     errorResult = {
//       errorCount: 1,
//       warningCount: 0,
//       messages: [
//         {
//           fatal: true,
//           message: 'broken something or other',
//           ruleId: 'broken-things',
//         },
//       ],
//       filePath: filePath,
//     };
//     warningResult = {
//       errorCount: 0,
//       warningCount: 1,
//       messages: [
//         {
//           fatal: false,
//           line: 1,
//           column: 2,
//           message: 'you should do this',
//           ruleId: 'advised',
//         },
//       ],
//       filePath: filePath,
//     };
//   });

//   describe('clean', function() {
//     // Possible this test might fail. haha oh well...
//     // Works for now.
//     it('prints out a checkmark with the date', function() {
//       let time = new Date().toLocaleTimeString();
//       let result = formatter([]);
//       expect(strip(result)).to.equal(`${icons.check} Clean (${time})`);
//     });
//   });

//   describe('errors', function() {
//     // can break sometimes
//     it('prints out errors if there are any', function() {
//       let time = new Date().toLocaleTimeString();
//       let result = formatter([errorResult]);
//       expect(strip(result)).to.equal(`${filePath} (1/0)\n  ${icons.x}  0:0  broken something or other  broken-things\n\n${icons.x} 1 error (${time})\n`);
//     });

//     it('prints out errors if there are multiple', function() {
//       let result = formatter([errorResult, errorResult]);
//       expect(result).to.includes('errors');
//     });
//   });

//   describe('warnings', function() {
//     // can break
//     it('prints out any warnings if there are any', function() {
//       let time = new Date().toLocaleTimeString();
//       let result = formatter([warningResult]);
//       expect(strip(result)).to.equal(`${filePath} (0/1)\n  ${icons.ex}  1:2  you should do this  advised\n\n${icons.ex} 1 warning (${time})\n`);
//     });

//     it('prints out warnings if there are multiple', function() {
//       let result = formatter([warningResult, warningResult]);
//       expect(result).to.include('warnings');
//     });
//   });

//   describe('errors/warnings', function() {
//     it('prints out warnings and errors', function() {
//       let result = formatter([errorResult, warningResult]);
//       expect(result).to.include('1 error');
//       expect(result).to.include('1 warning');
//     });

//     it('prints out both errors and warnings', function() {
//       let result = formatter([errorResult, errorResult, warningResult, warningResult]);
//       expect(result).to.include('2 warnings');
//       expect(result).to.include('2 errors');
//     });

//     it('prints out both errors and warnings for one file', function() {
//       let results = [
//         {
//           errorCount: 1,
//           warningCount: 1,
//           messages: [
//             {
//               fatal: false,
//               line: 1,
//               column: 2,
//               message: 'you should do this',
//               ruleId: 'advised',
//             },
//             {
//               fatal: true,
//               line: 3,
//               column: 2,
//               message: 'you should do this',
//               ruleId: 'required',
//             },
//           ],
//           filePath: filePath,
//         },
//       ];
//       let result = strip(formatter(results));
//       expect(result).to.include('(1/1)');
//       expect(result).to.include('1 warning');
//       expect(result).to.include('1 error');
//       expect(result).to.include('required');
//       expect(result).to.not.include('undefined');
//     });
//   });
// });
