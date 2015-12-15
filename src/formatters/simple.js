import _ from 'lodash';
import error from './helpers/error-warning';

export default function simple(results) {
  let message = '';
  _.each(results, result =>{
    if (result.errorCount !== 0 || result.warningCount !== 0) {
      message += `${error(result)}\n`;
    }
  });
  return message;
};
