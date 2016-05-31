'use strict';
var path = require('path');

module.exports = {
  normalize: function(thePath){
    thePath = thePath.replace(/\//, path.sep);
    thePath = thePath.replace(/\\/, path.sep);
    thePath = thePath.replace(/ /g, '\\ ');
    return thePath;
  }
};
