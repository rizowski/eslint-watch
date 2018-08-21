import fs from 'fs';
import path from 'path';

const helpText = fs.readFileSync(path.resolve(__dirname, './eslint-help.text'), 'utf8');

module.exports = {
  helpText,
};
