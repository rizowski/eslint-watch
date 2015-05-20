# Eslint Watch
[![Build Status](https://travis-ci.org/rizowski/eslint-watch.svg)](https://travis-ci.org/rizowski/eslint-watch)
[![NPM version](https://badge.fury.io/js/eslint-watch.svg)](http://badge.fury.io/js/eslint-watch)
[![Dependancies](https://david-dm.org/rizowski/eslint-watch.svg)](https://david-dm.org/rizowski/eslint-watch#info=dependencies)
[![devDependency Status](https://david-dm.org/rizowski/eslint-watch/dev-status.svg)](https://david-dm.org/rizowski/eslint-watch#info=devDependencies)
[![Code Climate](https://codeclimate.com/github/rizowski/eslint-watch/badges/gpa.svg)](https://codeclimate.com/github/rizowski/eslint-watch)

[![Join the chat at https://gitter.im/rizowski/eslint-watch](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/rizowski/eslint-watch?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Tired of typing `eslint ./` or `npm run lint` all the time? Don't want to import Webpack, Grunt, or some other task package into your project? Then this is the tool for you. In this repo we use [Chokidar](https://www.npmjs.com/package/chokidar) for file system watching. (All that means is it is fast)
Eslint Watch is a simple file watcher that wraps [Eslint](https://www.npmjs.com/package/eslint). All commands that Eslint offers can be used with the addition of a watch command. Don't believe me? Checkout the [code](https://github.com/rizowski/eslint-watch) or some of the features below!

## Getting started
To run eslint-watch without the global install, make an npm script.
  - `npm install eslint-watch [-g]`

## Features added
  - (Multi) Directory watching
    - `esw -w dir1/ dir2/`
  - Eslint-Watch will lint the current working directory by default. A directory is no longer required.
    - `esw [options] [file.js ...] [dir ...]`
  - [Simple formatter](#new-formatters)
    - `esw -f simple[-success]`
    
## Options
```
esw [options] [file.js, ...] [dir]

Options:
  -h, --help                  Show help
  -c, --config path::String   Use configuration from this file
  --rulesdir [path::String]   Use additional rules from this directory
  -f, --format String         Use a specific output format - default: stylish
  -v, --version               Outputs the version number
  --reset                     Set all default rules to off - default: false
  --no-eslintrc               Disable use of configuration from .eslintrc
  --env [String]              Specify environments
  --ext [String]              Specify JavaScript file extensions - default: .js
  --plugin [String]           Specify plugins
  --global [String]           Define global variables
  --rule Object               Specify rules
  --ignore-path path::String  Specify path of ignore file
  --no-ignore                 Disable use of .eslintignore
  --no-color                  Disable color in piped output
  -o, --output-file path::String  Specify file to write report to
  --quiet                     Report errors only - default: false
  --stdin                     Lint code provided on <STDIN> - default: false
  --stdin-filename String     Specify filename to process STDIN as
  -w, --watch                 Enable file watch
```

## New Formatters
[![simple with watch](http://i.imgur.com/Jci7PFvl.png)](http://i.imgur.com/Jci7PFv.png)

[![simple-success with watch](http://i.imgur.com/pAYv9Lol.png)](http://i.imgur.com/pAYv9Lo.png)
