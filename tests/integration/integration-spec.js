import child from 'child_process';
import path from 'path';

import pkg from '../../package';

const eswPath = path.join(__dirname, '../../bin/esw');
const testFiles = path.join(__dirname, 'test-files');

describe('integration', function(){
  let esw;
  before(function(){
    esw = function(cmd){
      let result = {};
      try{
        let command = 'node "' + eswPath + '" ' + cmd;
        result.message = child.execSync(command).toString();
        result.error = false;
      } catch(e){
        result.error = true;
        result.message = e.stdout.toString();
        result.cmd = e.cmd;
      }
      return result;
    };
  });

  describe('general', function(){
    it('reports any kind of help information', function(){
      let output = esw('--help');
      expect(output.error).to.be.false;
      expect(output.message).to.have.string('esw [options]');
    });

    it("cache command doesn't show help", function(){
      let output = esw('--cache --cache-location node_modules/esw.cache');
      expect(output.error).to.be.false;
      expect(output.message).to.not.have.string('Options');
    });

    it("doesn't throw when a no option is used", function(){
      let output = esw('--no-color');
      expect(output.error).to.be.false;
    });
  });

  describe('help', function(){
    it('has -w and --watch', function() {
      let output = esw('--help');
      expect(output.error).to.be.false;
      expect(output.message).to.have.string('-w');
      expect(output.message).to.have.string('--watch');
    });

    it('has simple-detail as default format', function(){
      let output = esw('--help');
      expect(output.error).to.be.false;
      expect(output.message).to.have.string('default: simple-detail');
    });
  });

  describe('watching', function(){
    beforeEach(function(){

    });

    afterEach(function(){

    });
  });

  describe('linting', function(){
    it('finds 5 issues in test-files', function(){
      let output = esw(`--no-ignore "${testFiles}"`);
      expect(output.error).to.be.true;
      expect(output.message).to.have.string('5 errors');
    });

    it('finds 2 warnings', function(){
      let output = esw(`--no-ignore "${testFiles}"`);
      expect(output.error).to.be.true;
      expect(output.message).to.have.string('2 warnings');
    });

    it("doesn't find warnings with --quiet", function(){
      let output = esw('--quiet --no-ignore "' + testFiles + '"');
      expect(output.error).to.be.true;
      expect(output.message).to.not.have.string('2 warnings');
    });
  });

  describe('version', function(){
    it('prints out eslint-watch version with --esw-version', () =>{
      const output = esw('--esw-version');
      expect(output.error).to.be.false;
      expect(output.message.trim()).to.equal(pkg.version);
    });
  });
});
