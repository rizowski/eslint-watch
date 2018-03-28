import formatter from '../../../src/formatters/simple';
import strip from 'strip-ansi';

describe('simple formatter', function () {
  it('prints the error count', function () {
    let object = { errorCount: 4, warningCount: 0, filePath: '/some/file/path' };
    let result = formatter([object]);
    expect(strip(result)).to.equal('4/0 /some/file/path\n');
  });

  it('prints nothing if there are no errors or warnings', function () {
    let result = formatter([{ errorCount: 0, warningCount: 0 }]);
    expect(result).to.equal('');
  });
});
