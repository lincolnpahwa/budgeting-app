import Controller from '@ember/controller';
import { storageFor } from 'ember-local-storage';
import {
    computed,
    get,
    set
} from '@ember/object';
import { 
    map,
    sort
} from '@ember/object/computed';

import { Transaction, transactionReducer} from '../domain/transaction';

export default Controller.extend({
    transactions: storageFor('transactions'),

    transactionModels: map('transactions.content', function(transaction) {
        return new Transaction(transaction);
    }),

    transactionsList: sort('transactionModels', function(transaction1, transaction2) {
        return transaction1.compare(transaction2);
    }),

    transactionsFlatList: computed('transactionsList', function() {
        let transactionFlatList = [];
        const transactionsList = get(this, 'transactionsList');
        const totalsRow = {
            type: {
                label: 'Totals'
            },
            date: null,
            category: 'totals-row',
            amount: 0,
            rolling: null
        };
        const transactionsByYear = transactionsList.reduce((map, transaction) => {
            const transactionYear = transaction.year();
            const yearlyTotalsRow = {
                type: {
                    label: transactionYear
                },
                date: null,
                category: 'yearly-totals-row',
                amount: 0
            };
            const monthlyReducer = transactionReducer(yearlyTotalsRow, transactionYear);
        
            map[transactionYear] = map[transactionYear] || {
                yearlyTotalsRow,
                months: transactionsList.reduce(monthlyReducer, {})
            };

            return map;
        }, {});

        let previousYearRow = null;

        Object.values(transactionsByYear).forEach(({yearlyTotalsRow, months}) => {
            Object.values(months).forEach(({total, rows}) => {
                if (transactionFlatList.length > 0) {
                    total.rolling += transactionFlatList[transactionFlatList.length - 1].rolling + parseFloat(total.amount);
                } else {
                    total.rolling = (previousYearRow ? previousYearRow.amount : 0) + parseFloat(total.amount);
                }
                transactionFlatList = transactionFlatList.concat(...rows, total);
            });

            transactionFlatList.push(yearlyTotalsRow);
            totalsRow.amount += yearlyTotalsRow.amount;
            yearlyTotalsRow.rolling = (previousYearRow ? previousYearRow.amount : 0) +  yearlyTotalsRow.amount;
            previousYearRow = yearlyTotalsRow;
        });

        transactionFlatList.push(totalsRow);

        return transactionFlatList;
    }),

    init() {
        this._super(...arguments);
        set(this, 'isAddingTransaction', false);
        
    },

    actions: {
        toggleAddTransaction() {
            set(this, 'isAddingTransaction', !get(this, 'isAddingTransaction'));
        },
        onSaveTransaction(transaction) {
            this.transactions.pushObject(transaction);
        }
    }
});
