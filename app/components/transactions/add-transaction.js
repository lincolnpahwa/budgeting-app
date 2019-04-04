import Component from '@ember/component';
import {Transaction, TransactionTypes} from '../../domain/transaction';

import {
    computed,
    get,
    set
} from '@ember/object';

const TRANSACTION_KEY = 'transaction';

export default Component.extend({
    classNames: ['add-transaction-component'],
    isSaveEnabled: computed('transaction.{type,amount,date}', function() {
        const transaction = get(this, TRANSACTION_KEY);

        return transaction.type
            && transaction.amount
            && transaction.date;
    }),

    init() {
        this._super(...arguments);
        set(this, TRANSACTION_KEY, new Transaction({}));
        set(this, 'transactionTypes', TransactionTypes);
    },

    actions: {
        save() {
            this.saveTransaction(get(this, TRANSACTION_KEY));
            set(this, TRANSACTION_KEY, new Transaction({}));
        },

        selectType(type) {
            set(this, 'transaction.type', type);
        }
    }
});
