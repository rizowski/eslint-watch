const eslint = require('../../../src/eslint');

describe('unit: eslint', () => {
  it('returns options for optionator', async () => {
    const options = await eslint.getHelpOptions();

    expect(options)
      .to.be.an('array')
      .and.have.length(42);

    options.forEach((o) => {
      if (o.heading) {
        expect(o.heading).to.be.a('string');
        return;
      }
      expect(o).to.have.property('description');
      expect(o).to.have.property('option');
      expect(o).to.have.property('type');
      if (o.alias) {
        expect(o.alias).to.be.a('string');
      }
    });
  });
});
