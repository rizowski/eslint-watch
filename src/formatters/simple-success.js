import _ from 'lodash';

import success from './helpers/success';
import error from './helpers/error-warning';
import c from './helpers/characters';

export default function simpleSuccess(results) {
  return _.reduce(results, (message, result) =>{
    if (result.errorCount === 0 && result.warningCount === 0) {
      message += `${success(result)}${c.endLine}`;
    } else {
      message += `${error(result)}${c.endLine}`;
    }
    return message;
  }, '');
};
