import proxy from 'proxyquire';
import { expect, assert } from 'chai';
import _ from 'lodash';

describe('eslint/help', () => {
  let title = 'title with options';
  let optionsTxt = 'Options:';
  let helpTxt = '--help      This has no alias or type';
  let cluck = '-c --cluck Boolean     Goes Cluck';
  let noAlias = '--see String     no alias';
  let noType = '-n --nope      no type to be found here';
  let msg;
  let help;

  before(() => {
    help = proxy('../../src/eslint/help', {
      './cli': () => {
        return {
          stdout: {
            on: (name, callback) => {
              callback(msg);
            }
          }
        };
      }
    });
  });

  beforeEach(() => {
    msg = title + '\n' +
        '\n' +
        optionsTxt + '\n' +
        helpTxt + '\n' +
        cluck + '\n' +
        noAlias + '\n' +
        noType + '\n';
  });

  it('has an alias if one is provided', (done) => {
    return help()
      .then((options) => {
        let option = options[0];
        expect(option.alias).to.equal('c');
        done();
      });
  });

  it('does not have an alias if not provided', (done) => {
    return help()
      .then((options) => {
        let option = options[1];
        expect(option.alias).to.equal(undefined);
        done();
      });
  });

  it('has a type', (done) => {
    return help()
      .then((options) => {
        let option = options[0];
        expect(option.type).to.equal('Boolean');
        done();
      });
  });

  it('has a full description', (done) => {
    return help()
      .then((options) => {
        let option = options[0];
        expect(option.description).to.equal('Goes Cluck');
        done();
      });
  });

  it('filters out help', (done) => {
    return help()
      .then((options) => {
        _.each(options, (option) => {
          assert.notEqual(option.option, 'help');
        });
        done();
      });
  });

  it('filters out format', (done) => {
    msg += '-f --format String     Stringify' + '\n';
    return help()
      .then((options) => {
        _.each(options, (option) => {
          assert.notEqual(option.option, 'format');
        });
        done();
      });
  });

  it("doesn't set an option as undefined", (done) => {
    return help()
      .then((options) => {
        _.each(options, (option) => {
          assert.ok(option.option);
        });
        done();
      });
  });

  it("doesn't set an alias as undefined", (done) => {
     msg = title + '\n' +
        '\n' +
        optionsTxt + '\n' +
        helpTxt + '\n' +
        cluck + '\n';
    return help()
      .then((options) => {
        _.each(options, (option) => {
          assert.ok(option.alias);
        });
        done();
      });
  });

  it("doesn't set a type as undefined", (done) => {
    return help()
      .then((options) => {
        _.each(options, (option) => {
          assert.ok(option.type);
        });
        done();
      });
  });

  it("doesn't set a description as undefined", (done) => {
    return help()
      .then((options) => {
        _.each(options, (option) => {
          assert.ok(option.description);
        });
        done();
      });
  });

  it("sets the default to Boolean if type isn't provided", (done) => {
    return help()
      .then((options) => {
        let option = options[2];
        expect(option.type).to.equal('Boolean');
        done();
      });
  });

  it("shouldn't throw exceptions", (done) => {
    msg = title + '\n' +
       '\n' +
       optionsTxt + '\n' +
       helpTxt + '\n' +
       '\n' +
       'HEADING:\n'+
       cluck + '\n';
    expect(() => {
      return help()
        .then((options) => {
          let option = options[0];
          expect(option.type).to.equal('Boolean');
          done();
        });
    }).to.not.throw();
  });
});
