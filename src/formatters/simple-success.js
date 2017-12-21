import _ from 'lodash';

import success from './helpers/success';
import error from './helpers/error-warning';
import c from './helpers/characters';

export default function simpleSuccess(results) {
  return _.reduce(results, (message, result) => {
    message += result.errorCount === 0 && result.warningCount === 0
      ? `${success(result)}${c.endLine}`
      : `${error(result)}${c.endLine}`;

    return message;
  }, '');
};
