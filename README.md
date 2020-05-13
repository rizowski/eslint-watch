# Eslint Watch

[![](https://img.shields.io/badge/release-notes-blue.svg)](https://github.com/rizowski/eslint-watch/releases/latest)
[![Build Status](https://travis-ci.org/rizowski/eslint-watch.svg?branch=master)](https://travis-ci.org/rizowski/eslint-watch)
[![Coverage Status](https://coveralls.io/repos/github/rizowski/eslint-watch/badge.svg?branch=dep-coverage)](https://coveralls.io/github/rizowski/eslint-watch?branch=dep-coverage)
[![Code Climate](https://codeclimate.com/github/rizowski/eslint-watch/badges/gpa.svg)](https://codeclimate.com/github/rizowski/eslint-watch)
[![Dependencies](https://www.versioneye.com/nodejs/eslint-watch/reference_badge.svg?style=flat-square)](https://github.com/rizowski/eslint-watch/network/dependencies)

Don't want to import Webpack, Grunt, or some other task package into your project? Then this is the tool for you.
Eslint Watch is a simple command line tool that wraps [Eslint](https://www.npmjs.com/package/eslint). Eslint Watch provides file watching and command line improvements to the currently existing Eslint command line interface. All commands that Eslint offers can be used with the addition of a watch command and a couple new templating views. Don't believe me? Checkout the [code](https://github.com/rizowski/eslint-watch) or some of the features below!

## Requirements

To use this tool we require eslint to be installed on your project. The versions supported are:

- `"eslint": ">=7 <8.0.0"`
- `node >= 10.0.0 <= LTS` Non LTS versions will have limited support.

## Getting started

To run eslint-watch without the global install, make an npm script.

### NPM

- `npm i -g eslint eslint-watch` or `npm i -D eslint eslint-watch`

### Yarn

- `yarn global add eslint eslint-watch` or `yarn add -D eslint eslint-watch`

## Features added

- Watching
  - Multi-directory watching
  - Runs a full directory lint before the watch
  - Press `enter` to rerun directory lint while watching
  - Include directories to ignore on watch
- Eslint Overrides
  - Default directory linting. A directory is no longer required.

## Options/Usage

Eslint-Watch replaces only a few commands that it needs to take control over. All other commands are forwarded to Eslint unmodified. Please refer to their help text for full command support as the one provided below might not be up to date with the latest Eslint changes.

```md
esw [options][file.js ...] [dir ...]

ESW Options:
-h, --help Show help
-w, --watch Enable file watch
--changed Enables single file linting while watch is enabled
--clear Clear terminal when running lint
-v, --version Prints Eslint-Watch Version
--versions Prints Eslint-Watch and Eslint Versions
--watch-ignore RegExp Regex string of folders to ignore when watching - default: /.git|node_modules|bower_components/
--watch-delay Int Delay(ms) for watcher to wait to trigger re-lint - default: 300

Basic configuration:
--ext [String] Specify JavaScript file extensions - default: .js
--no-eslintrc Disable use of configuration from .eslintrc._
-c, --config path::String Use this configuration, overriding .eslintrc._ config options if present
--env [String] Specify environments
--global [String] Define global variables
--parser String Specify the parser to be used
--parser-options Object Specify parser options
--resolve-plugins-relative-to path::String A folder where plugins should be resolved from CWD by default

Specifying rules and plugins:
--rulesdir [path::String] Use additional rules from this directory
--plugin [String] Specify plugins
--rule Object Specify rules

Fixing problems:
--fix Automatically fix problems
--fix-dry-run Automatically fix problems without saving the changes to the file system
--fix-type Array Specify the types of fixes to apply (problem suggestion, layout)

Ignoring files:
--ignore-path path::String Specify path of ignore file
--no-ignore Disable use of ignore files and patterns
--ignore-pattern [String] Pattern of files to ignore (in addition to those in .eslintignore)

Using stdin:
--stdin Lint code provided on <STDIN> - default: false
--stdin-filename String Specify filename to process STDIN as

Handling warnings:
--quiet Report errors only - default: false
--max-warnings Int Number of warnings to trigger nonzero exit code - default: -1

Output:
-o, --output-file path::String Specify file to write report to
-f, --format String Use a specific output format - default: stylish
--color, --no-color Force enabling/disabling of color

Inline configuration comments:
--no-inline-config Prevent comments from changing config or rules
--report-unused-disable-directives Adds reported errors for unused eslint-disable directives

Caching:
--cache Only check changed files - default: false
--cache-file path::String Path to the cache file. Deprecated: use --cache-location - default: .eslintcache
--cache-location path::String Path to the cache file or directory

Miscellaneous:
--init Run config initialization wizard - default: false
--debug Output debugging information
--print-config path::String Print the configuration for the given file
```

### Other Options

Eslint-Watch uses [`chokidar`](https://github.com/paulmillr/chokidar) under the hood to watch for changes. Chokidar can be configured to poll for changes (this might be necessary if you are running Eslint-Watch inside a VM or Container) by setting the `CHOKIDAR_USEPOLLING` environment variable to `true`.

## Functionality

[![Simple lint and watch](https://thumbs.gfycat.com/AgreeableForsakenIvorygull-size_restricted.gif)](https://fat.gfycat.com/AgreeableForsakenIvorygull.gif)

Donate:

- (Ƀitcoin): `13V7iDxBhnFASw7avGGRk64ExDGTirhx37`

- (PayPal): [https://www.paypal.me/rizowski](https://www.paypal.me/rizowski)
