const eslint = require('../../src/eslint');

describe('unit: eslint', () => {
  it('returns options for optionator', async () => {
    const options = await eslint.getHelp();

    expect(options).to.be.an('array');

    options.forEach((o) => {
      expect(o).to.have.property('description');
      expect(o).to.have.property('option');
      expect(o).to.have.property('type');
      if (o.alias) {
        expect(o.alias).to.be.a('string');
      }
    });
  });
});
