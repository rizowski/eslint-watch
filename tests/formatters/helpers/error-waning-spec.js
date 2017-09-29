import formatter from '../../../src/formatters/helpers/error-warning';
import strip from 'strip-ansi';

describe('error-warning-helper', function () {
  it('prints error count if errorCount exists', function () {
    let object = { errorCount: 4, warningCount: 0, filePath: '/some/file/path' };
    let result = formatter(object);
    expect(strip(result)).to.equal('4/0 /some/file/path');
  });

  it('prints warning count if warningCount exists', function () {
    let object = { errorCount: 0, warningCount: 4, filePath: '/some/file/path' };
    let result = formatter(object);
    expect(strip(result)).to.equal('0/4 /some/file/path');
  });

  it('prints just errors when there are messages', function () {
    let object = { messages: ['hello', 'two'], filePath: '/some/file/path' };
    let result = formatter(object);
    expect(strip(result)).to.equal('2 /some/file/path');
  });
});
