import _ from 'lodash';

import error from './helpers/error-warning';
import c from './helpers/characters';

export default function simple(results) {
  return _.reduce(results, (str, result) =>{
    if (result.errorCount !== 0 || result.warningCount !== 0) {
      str += `${error(result)}${c.endLine}`;
    }
    return str;
  }, '');
};
