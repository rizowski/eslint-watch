[![Stories in Ready](https://badge.waffle.io/rizowski/eslint-watch.png?label=ready&title=Ready)](https://waffle.io/rizowski/eslint-watch)
# Eslint Watch ([Release Notes](https://github.com/rizowski/eslint-watch/releases/latest))
[![Build Status](https://travis-ci.org/rizowski/eslint-watch.svg?branch=master)](https://travis-ci.org/rizowski/eslint-watch)
[![Build status](https://ci.appveyor.com/api/projects/status/0v5dn6wqofyp6ldb/branch/master?svg=true)](https://ci.appveyor.com/project/rizowski/eslint-watch/branch/master)
[![NPM version](https://badge.fury.io/js/eslint-watch.svg)](http://badge.fury.io/js/eslint-watch)
[![Dependency Status](https://www.versioneye.com/user/projects/5607150e5a262f001e00033e/badge.svg?style=flat)](https://www.versioneye.com/user/projects/5607150e5a262f001e00033e)
[![devDependency Status](https://david-dm.org/rizowski/eslint-watch/dev-status.svg)](https://david-dm.org/rizowski/eslint-watch#info=devDependencies)
[![Code Climate](https://codeclimate.com/github/rizowski/eslint-watch/badges/gpa.svg)](https://codeclimate.com/github/rizowski/eslint-watch)

[![Reference Status](https://www.versioneye.com/nodejs/eslint-watch/reference_badge.svg?style=flat)](https://www.versioneye.com/nodejs/eslint-watch/references)

[![Join the chat at https://gitter.im/rizowski/eslint-watch](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/rizowski/eslint-watch?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Don't want to import Webpack, Grunt, or some other task package into your project? Then this is the tool for you.
Eslint Watch is a simple command line tool that wraps [Eslint](https://www.npmjs.com/package/eslint). Eslint Watch provides file watching and command line improvements to the currently existing Eslint command line interface. All commands that Eslint offers can be used with the addition of a watch command and a couple new templating views. Don't believe me? Checkout the [code](https://github.com/rizowski/eslint-watch) or some of the features below!

## Requirements
To use this tool we require eslint to be installed on your project. The versions supported are:
  - `"eslint": ">=0.19.0 <2.0.0"`

## Getting started
To run eslint-watch without the global install, make an npm script.
  - `npm install eslint-watch [-g]`

## Features added
  - Watching
    - Multi-directory watching
    - Runs a full directory lint before the watch
    - Press `enter` to rerun directory lint while watching
  - Eslint Overrides
    - Default directory linting. A directory is no longer required.
  - [Simple formatters](#new-formatters)
    - simple-detail (default)
    - simple
    - simple-success

## Options/Usage
```
esw [options] [file.js ...] [dir ...]

Options:
  -h, --help                 Show help
  -f, --format String        Use a specific output format - default: simple-detail
  -w, --watch                Enable file watch
  -c, --config path::String  Use configuration from this file or shareable config
  --no-eslintrc              Disable use of configuration from .eslintrc
  --env [String]             Specify environments
  --ext [String]             Specify JavaScript file extensions - default: .js
  --global [String]          Define global variables
  --parser String            Specify the parser to be used - default: espree
  --cache                    Only check changed files - default: false
  --cache-file String        Path to the cache file - default: .eslintcache
  --rulesdir [path::String]  Use additional rules from this directory
  --plugin [String]          Specify plugins
  --rule Object              Specify rules
  --ignore-path path::String  Specify path of ignore file
  --no-ignore                Disable use of .eslintignore
  --ignore-pattern String    Pattern of files to ignore (in addition to those in .eslintignore)
  --stdin                    Lint code provided on <STDIN> - default: false
  --stdin-filename String    Specify filename to process STDIN as
  --quiet                    Report errors only - default: false
  --max-warnings Number      of warnings to trigger nonzero exit code - default: -1
  -o, --output-file path::String  Specify file to write report to
  --no-color                 Disable color in piped output
  --init                     Run config initialization wizard - default: false
  --fix                      Automatically fix problems
  --debug                    Output debugging information
  -v, --version              Outputs the version number
```

## Functionality
[![Simple lint and watch](http://i.imgur.com/gPZSXU0.png)](http://i.imgur.com/gPZSXU0.png)

## New Formatters
[![simple simple-success simple-detail](http://i.imgur.com/m757NwM.png)](http://i.imgur.com/m757NwM.png)
