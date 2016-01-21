import _ from 'lodash';
import success from './helpers/success';
import error from './helpers/error-warning';

export default function simpleSuccess(results) {
  let message = '';
  _.each(results, result => {
    if (result.errorCount === 0 && result.warningCount === 0) {
      message += `${success(result)}\n`;
    } else {
      message += `${error(result)}\n`;
    }
  });
  return message;
};
