import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;
global.assert = chai.assert;
