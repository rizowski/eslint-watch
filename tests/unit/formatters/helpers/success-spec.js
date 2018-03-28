import formatter from '../../../../src/formatters/helpers/success';
import strip from 'strip-ansi';

describe('success-helper', function () {
  it('places a checkmark and the path', function () {
    let object = { filePath: '/some/file/path' };
    let result = formatter(object);
    expect(strip(result)).to.equal('✓ /some/file/path');
  });
});
