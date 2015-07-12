'use strict';
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

var expect = chai.expect;

describe('eslint-cli', function () {
  var cli;
  var platform = 'win32';
  var osStub;
  var childSpy;
  var pathStub;
  var os;
  var path;
  var child;

  before(function(){
    os = require('os');
    child = require('child-process-promise');
    path = require('path');
    cli = require('../src/eslint-cli');
  });

  beforeEach(function(){
    osStub = sinon.stub(os, 'platform', function(){
      return platform;
    });
    childSpy = sinon.spy(child.spawn);

    pathStub = sinon.stub(path, 'resolve', function(){
      return arguments;
    });
  });

  afterEach(function(){
    osStub.restore();
    pathStub.restore();
  });

  it('executes eslint.cmd for win32', function(){
    var args = ['-a', 'simple', './'];
    platform = 'win32';
    cli(args);
    expect(childSpy.calledWith('./node_modules/.bin/eslint.cmd', args, {stdio: 'inherit'}));
  });

  it('executes eslint for other os', function(){
    var args = ['-a', 'simple', './'];
    platform = 'osx';
    cli(args);
    expect(childSpy.calledWith('./node_modules/.bin/eslint', args, {stdio: 'inherit'}));
  });
});
