import tr from '../index.js';

const test = QUnit.test;

QUnit.module('tr', {
    beforeEach: function () {
        tr.append({
            'hello': 'bonjour',
            'hello ${0}': 'bonjour ${0}'
        })
    }
});

test('translates literal words', assert => {
    const m = tr`hello`;

    assert.equal(m, 'bonjour');
});

test('returns original message when no translation available', assert => {
    const m = tr`hi`;

    assert.equal(m, 'hi');
});

test('translates with one argument', assert => {
    const m = tr`hello ${'john'}`;

    assert.equal(m, 'bonjour john');
});
