# Eslint Watch

[![](https://img.shields.io/badge/release-notes-blue.svg)](https://github.com/rizowski/eslint-watch/releases/latest)
[![Build Status](https://github.com/rizowski/eslint-watch/actions/workflows/ci.yml/badge.svg)](https://github.com/rizowski/eslint-watch/actions/workflows/ci.yml)
[![Code Climate](https://codeclimate.com/github/rizowski/eslint-watch/badges/gpa.svg)](https://codeclimate.com/github/rizowski/eslint-watch)

Don't want to import Webpack, Grunt, or some other task package into your project? Then this is the tool for you.
Eslint Watch is a simple command line tool that wraps [Eslint](https://www.npmjs.com/package/eslint). Eslint Watch provides file watching and command line improvements to the currently existing Eslint command line interface. All commands that Eslint offers can be used with the addition of a watch command and a couple new templating views. Don't believe me? Checkout the [code](https://github.com/rizowski/eslint-watch) or some of the features below!

## Requirements

To use this tool we require eslint to be installed on your project. The versions supported are:

- `"eslint": ">=9 <11.0.0"`
- `node ^18.18.0 || ^20.9.0 || >=21.1.0` Non LTS versions will have limited support.

**Note:** ESLint v9+ uses [flat config](https://eslint.org/docs/latest/use/configure/configuration-files) (`eslint.config.js`) by default. Legacy `.eslintrc.*` config files are no longer supported.

## Getting started

To run eslint-watch without the global install, make an npm script.

### Installing

- `npm i -g eslint eslint-watch` or `npm i -D eslint eslint-watch`
- `yarn global add eslint eslint-watch` or `yarn add -D eslint eslint-watch`

## Features added

- Watching
  - Multi-directory watching
  - Runs a full directory lint before the watch
  - Press `enter` to rerun directory lint while watching
  - Include directories to ignore on watch
  - Respects `--ignore-pattern` in watch mode — ignored files won't trigger re-lints
  - Watches all file types by default — no longer limited to `.js` unless `--ext` is explicitly set
- Eslint Overrides
  - Default directory linting. A directory is no longer required.

## Options/Usage

Eslint-Watch replaces only a few commands that it needs to take control over. All other commands are forwarded to Eslint unmodified. Please refer to their help text for full command support as the one provided below might not be up to date with the latest Eslint changes.

```md
esw [options] [file.js ...] [dir ...]

ESW Options:
  -h, --help                     Show help
  -w, --watch                    Enable file watch
  --changed                      Enables single file linting while watch is enabled
  --clear                        Clear terminal when running lint
  -v, --version                  Prints Eslint-Watch Version
  --versions                     Prints Eslint-Watch and Eslint Versions
  --watch-ignore RegExp          Regex string of folders to ignore when watching - default:
                                 /.git|node_modules|bower_components|.eslintcache/
  --watch-delay Int              Delay(ms) for watcher to wait to trigger re-lint - default: 300

Basic configuration:
  --no-config-lookup             Disable look up for eslint.config.js
  -c, --config path::String      Use this configuration instead of eslint.config.js, eslint.config.mjs, or
                                 eslint.config.cjs
  --inspect-config               Open the config inspector with the current configuration
  --global [String]              Define global variables
  --parser String                Specify the parser to be used
  --parser-options Object        Specify parser options

Specify Rules and Plugins:
  --plugin [String]              Specify plugins
  --rule Object                  Specify rules

Fix Problems:
  --fix                          Automatically fix problems
  --fix-dry-run                  Automatically fix problems without saving the changes to the file system
  --fix-type Array               Specify the types of fixes to apply (directive, problem, suggestion, layout)

Ignore Files:
  --no-ignore                    Disable use of ignore files and patterns
  --ignore-pattern [String]      Patterns of files to ignore

Use stdin:
  --stdin                        Lint code provided on <STDIN> - default: false
  --stdin-filename String        Specify filename to process STDIN as

Handle Warnings:
  --quiet                        Report errors only - default: false
  --max-warnings Int             Number of warnings to trigger nonzero exit code - default: -1

Output:
  -o, --output-file path::String  Specify file to write report to
  -f, --format String            Use a specific output format - default: stylish
  --color, --no-color            Force enabling/disabling of color

Inline configuration comments:
  --no-inline-config             Prevent comments from changing config or rules
  --report-unused-disable-directives  Adds reported errors for unused eslint-disable and eslint-enable directives
  --report-unused-disable-directives-severity String  Chooses severity level for reporting unused
                                 eslint-disable and eslint-enable directives

Caching:
  --cache                        Only check changed files - default: false
  --cache-file path::String      Path to the cache file. Deprecated: use --cache-location - default: .eslintcache
  --cache-location path::String  Path to the cache file or directory
  --cache-strategy String        Strategy to use for detecting changed files in the cache - default: metadata

Miscellaneous:
  --init                         Run config initialization wizard - default: false
  --env-info                     Output execution environment information - default: false
  --no-error-on-unmatched-pattern  Prevent errors when pattern is unmatched
  --exit-on-fatal-error          Exit with exit code 2 in case of fatal error - default: false
  --no-warn-ignored              Suppress warnings when the file list includes ignored files
  --pass-on-no-patterns          Exit with exit code 0 in case no file patterns are passed
  --debug                        Output debugging information
  --print-config path::String    Print the configuration for the given file
  --stats                        Add statistics to the lint report - default: false
  --flag [String]                Enable a feature flag
```

### Other Options

Eslint-Watch uses [`chokidar`](https://github.com/paulmillr/chokidar) under the hood to watch for changes. Chokidar can be configured to poll for changes (this might be necessary if you are running Eslint-Watch inside a VM or Container) by setting the `CHOKIDAR_USEPOLLING` environment variable to `true`.

## Functionality

[![Simple lint and watch](https://thumbs.gfycat.com/AgreeableForsakenIvorygull-size_restricted.gif)](https://fat.gfycat.com/AgreeableForsakenIvorygull.gif)

Donate:

- (Ƀitcoin): `13V7iDxBhnFASw7avGGRk64ExDGTirhx37`

- (PayPal): [https://www.paypal.me/rizowski](https://www.paypal.me/rizowski)
