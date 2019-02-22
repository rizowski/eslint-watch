import logger from '../../../src/logger';
import eslint from '../../../src/eslint';

describe('eslint/options', () => {
  describe('#getHelpOptions', () => {
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

  describe('#execute', () => {});

  describe('#lint', () => {
    let sandbox;
    let loggerStub;

    before(() => {
      sandbox = sinon.createSandbox();
      loggerStub = {
        log: sandbox.stub(),
        error: sandbox.stub(),
        debug: sandbox.stub(),
      };
      sandbox.stub(logger, 'createLogger').callsFake(() => loggerStub);
    });

    after(() => {
      sandbox.restore();
    });

    it('logs clean if no results come back', async () => {
      await eslint.lint();
      expect(loggerStub.log.calledOnce).to.equal(true);
    });
  });
});
