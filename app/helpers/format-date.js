import { helper } from '@ember/component/helper';
import moment from 'moment';

export function formatDate([value]) {
  if (value === null) return '';
  return moment(value).format('MMM D, YYYY');
}

export default helper(formatDate);
