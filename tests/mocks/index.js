const fs = require('fs');
const path = require('path');

const helpText = fs.readFileSync(path.resolve(__dirname, './eslint-help.text'), 'utf8');

module.exports = {
  helpText,
};
