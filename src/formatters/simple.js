'use strict';
var error = require('./helpers/error-warning');

module.exports = function (results) {
  var message = '';
  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    if (result.errorCount !== 0 || result.warningCount !== 0) {
      message += error(result);
      message += '\n';
    }
  }
  return message;
};
