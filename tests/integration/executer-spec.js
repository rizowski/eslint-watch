const { expect } = require('chai');
const executer = require('../../src/eslint/executer');

describe('integration: executer', () => {
  it('returns result with good exit code', async () => {
    const result = await executer.execute('echo', ['hello']);
    expect(result).to.include('hello');
  });

  it('rejects if an error occurred', async () => {
    try {
      await executer.execute('exit', ['1']);
    } catch (error) {
      expect(error.message).to.equal('spawn exit ENOENT');
    }
  });
});
