import { helper } from '@ember/component/helper';

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  style: 'currency',
  currency: 'USD'
});

export function formatCurrency([value]) {
  if (value === null) {
    return '';
  }
  return formatter.format(value);
}

export default helper(formatCurrency);
