import { v4 } from 'ember-uuid';
import moment from 'moment';

export const TransactionTypes = [{
    type: 1,
    label: 'Income',
    multiplier: 1
}, {
    type: 2,
    label: 'Expense',
    multiplier: -1
}];

export const TransactionTypesMap = TransactionTypes.reduce((map, value) => {
    map[value.type] = value;

    return map;
}, {});

export class Transaction {
    constructor({
        type,
        amount,
        date,
        label = null,
        category = null,
        rolling = null
    }
    ) {
        this.uuid = v4();
        this.type = type;
        this.amount = amount;
        this.date = date;
        this.label = label || '';
        this.rolling = rolling;
        this.category = category;
    }

    update({
        type = null,
        amount = null,
        date = null,
        label = null,
        category = null
    }) {
        if (type) {
            this.type = type;
        }

        if (amount) {
            this.amount = amount;
        }

        if (date) {
            this.date = date;
        }

        if (label) {
            this.label = label;
        }

        if (category) {
            this.category = category;
        }
    }

    month() {
        return moment(this.date).month();
    }

    year() {
        return moment(this.date).year();
    }
    
    compare(other) {
        return moment(this.date).diff(moment(other.date));
    }
}

export function transactionReducer(totalsRow, year) {
    return (map, transaction) => {
        const transactionMonth = transaction.month();
        const transactionYear = transaction.year();
        if (transactionYear === year) {
            map[transactionMonth] = map[transactionMonth] || {
                total: {
                    type: {
                        label: `${moment.months(transactionMonth)} ${year}`
                    },
                    date: null,
                    amount: 0,
                    category: 'month-row',
                    rolling: 0
                },
                rows: []
            };
            const amountToAdd = transaction.type.multiplier * parseFloat(transaction.amount);
            map[transactionMonth]['total'].amount += amountToAdd;
            map[transactionMonth]['rows'].push(transaction);
            totalsRow.amount += amountToAdd;
        }
    
        return map;
    }
}