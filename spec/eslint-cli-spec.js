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
  var childStub;
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
    childStub = sinon.stub(child, 'spawn', function(prog, args, opts){
      return {prog: prog, args: args, opts: opts};
    });
    pathStub = sinon.stub(path, 'resolve', function(){
      return arguments;
    });
  });

  afterEach(function(){
    osStub.restore();
    childStub.restore();
    pathStub.restore();
  });

  it('executes eslint.cmd for win32', function(){
    var args = ['-f', 'simple', './'];
    platform = 'win32';
    var results = cli(args);
    console.log(results);
    expect(results.prog).to.equal('./node_modules/.bin/eslint.cmd');
  });

  it('executes eslint for other os', function(){
    var args = ['-f', 'simple', './'];
    platform = 'osx';
    var results = cli(args);
    expect(results.prog).to.equal('./node_modules/.bin/eslint');
  });

  it('executes eslint', function(){
    var args = ['-f', 'simple', './'];
    var results = cli(args);
    expect(results.args).to.equal(args);
  });
});
