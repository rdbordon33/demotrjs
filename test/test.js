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

test('supports plural form', assert => {
    tr.append({ 
        '${} items': [
            'no item',
            '${0} item',
            '${0} items'
        ]
    });

    assert.equal(tr`${0} items`, 'no item');
    assert.equal(tr`${1} items`, '1 item');
    assert.equal(tr`${2} items`, '2 items');
    assert.equal(tr`${42} items`, '42 items');
});

test('supports plural form for non numeric values', assert => {
    tr.append({ 
        '${} stuff': [
            'no stuff',
            'some stuff',
            'unreachable stuff'
        ]
    });

    assert.equal(tr`${false} stuff`, 'no stuff');
    assert.equal(tr`${true} stuff`, 'some stuff');
    assert.equal(tr`${''} stuff`, 'no stuff');
    assert.equal(tr`${'any'} stuff`, 'some stuff');
    assert.equal(tr`${[]} stuff`, 'some stuff');
    assert.equal(tr`${['any']} stuff`, 'some stuff');
});

test('supports plural form even if no dynamic parameter is available', assert => {
    tr.append({ 
        'some stuff': [
            'no stuff',
            'some stuff',
            'unreachable stuff'
        ]
    });

    assert.equal(tr`some stuff`, 'no stuff');
});
