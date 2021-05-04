import tr from '../index.js';

const test = QUnit.test;

QUnit.module("tr");

test('translates literal words', assert => {
    tr.append({ 'hello': 'bonjour' });

    const m = tr`hello`;

    assert.equal(m, 'bonjour');
});

test('returns original message when no translation available', assert => {
    const m = tr`hi`;

    assert.equal(m, 'hi');
});

test('translates with one argument', assert => {
    tr.append({ 'hello ${}': 'bonjour ${0}' });

    const m = tr`hello ${'john'}`;

    assert.equal(m, 'bonjour john');
});

test('translates with arguments in different order', assert => {
    tr.append({ 'reverse name ${} ${}': '${1} ${0}' });

    const m = tr`reverse name ${'john'} ${'doe'}`;

    assert.equal(m, 'doe john');
});

test('translates and repeat arguments', assert => {
    tr.append({ 'repeat firstname ${} ${}': '${0} ${0}' });

    const m = tr`repeat firstname ${'john'} ${'doe'}`;

    assert.equal(m, 'john john');
});

test('ignores invalid index', assert => {
    tr.append({ 'with invalid index ${}': '${0} ${1} ${2}' });

    const m = tr`with invalid index ${'john'}`;

    assert.equal(m, 'john  ');
});
