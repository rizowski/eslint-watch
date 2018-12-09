const eslint = require('../../../src/eslint');

describe('eslint/options', () => {
  it('returns options for optionator', async () => {
    const options = await eslint.getHelpOptions();

    expect(options).to.be.an('array');

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
