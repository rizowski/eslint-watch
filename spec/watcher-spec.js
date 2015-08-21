'use strict';
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

var expect = chai.expect;
var watcher = require('../src/watcher');
var chokidar = require('chokidar');

describe('Watcher', function () {
  var watchStub;
  var watchOnSpy;
  var watchAddSpy;

  beforeEach(function () {
    watchOnSpy = sinon.spy(function() {
      // No operations
    });

    watchAddSpy = sinon.spy(function() {
      // No operations
    });

    watchStub = sinon.stub(chokidar, 'watch', function() {
      return {
        on: watchOnSpy,
        add: watchAddSpy
      };
    });
  });

  afterEach(function () {
    chokidar.watch.restore();
  });

  it('should call the chokidar on function to activate watching', function () {
    watcher({
      _: './'
    });

    expect(watchOnSpy.calledOnce).to.be.true;
  });

  it('should use the correct default extension and directory', function () {
    watcher({
      _: './'
    });

    expect(watchAddSpy.calledWith('+()/**/*+(.js)$')).to.be.true;
  });

  it('should use the correct watch pattern when a directory is specified', function () {
    watcher({
      _: ['directory']
    });

    expect(watchAddSpy.calledOnce).to.be.true;
    expect(watchAddSpy.calledWith('+(directory)/**/*+(.js)$')).to.be.true;
  });

  it('should use the correct watch pattern when a file and extension are specified', function () {
    watcher({
      _: ['file.test'],
      ext: ['.test']
    });

    expect(watchAddSpy.calledOnce).to.be.true;
    expect(watchAddSpy.calledWith(['file.test'])).to.be.true;
  });

  it('should use the correct watch pattern when a complex set of files, directories, and extensions are specified', function () {
    watcher({
      _: ['file.test', 'file.js', 'directory1', 'directory2'],
      ext: ['.js', '.test']
    });

    expect(watchAddSpy.calledTwice).to.be.true;
    expect(watchAddSpy.calledWith(['file.test', 'file.js']));
    expect(watchAddSpy.calledWith('+(directory1|directory2)/**/*+(.js|.test)$'));
  });
});
