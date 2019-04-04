import Component from '@ember/component';

import { computed, get } from '@ember/object';

export default Component.extend({
    classNames: ['transaction-item'],

    classNameBindings: ['isMonthRow', 'isYearRow', 'isTotalsRow'],

    isMonthRow: computed('transaction.category', function() {
        return get(this, 'transaction.category') === 'month-row';
    }),

    isYearRow: computed('transaction.category', function() {
        return get(this, 'transaction.category') === 'yearly-totals-row';
    }),

    isTotalsRow: computed('transaction.category', function() {
        return get(this, 'transaction.category') === 'totals-row';
    })
});
