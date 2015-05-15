# Eslint Watch
[![Join the chat at https://gitter.im/rizowski/eslint-watch](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/rizowski/eslint-watch?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Eslint Watch is a simple file watcher that wraps eslint. All commands that eslint offers can be used with the addition of a watch command. The command will run based on the current directory.

## Features added
  - Directory Watching
  - Lints working directory by default 
    - `esw` will lint `./` by default
    - `esw src/` will lint `src/`
    - `esw -w` will watch lint `./`
    - `esw -w src/` will watch lint `src/`

## Options
```
esw [options] file.js [file.js] [dir]

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
