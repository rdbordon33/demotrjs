# tr.js - A lightweight i18n library for JavaScript

tr.js is a minimalistic module to handle internationalization in JavaScript.
The module provides *tr* which can be used as a function or a tag function
of [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

As a function, dynamic parameters can be indicated in the template string with 
the expression ```${}```.

```javascript
const w = "world";

const translation = tr("Hello the ${}", w);
```

```javascript
const w = "world";

const translation = tr`Hello the ${w}`;
```

## Configuring translations

You use the function ```tr.addTranslations``` to provide new translations. This
function expects an object as parameter. Each key of the object is a template string
and the value is the translated message:

```javascript
tr.addTranslations({
    "hello": "bonjour",
    "hi": "salut"
});

// result will be "bonjour"
const translation = tr("hello");
```

You can specify dynamic parameters in the template string and the translation with 
the expression ```${}```.

```javascript
tr.addTranslations({
    "hello ${}": "bonjour ${}"
});

// result will be "bonjour john"
const translation = tr("hello ${}", "john");
```

You can also use a template literal:

```javascript
const name = "john";
// result will be "bonjour john"
const translation = tr`hello ${name}`;
```

### Changing order of the dynamic arguments

If the order of the arguments is not the same in the translated expression,
you can specify explicitly the position of the dynamic arguments:

```javascript
tr.addTranslations({
    "total amount ${}${}": "montant total ${1}${0}"
});

// result will be "montant total 2400$"
const translation = tr`total amount ${'$'}${24*100}`;
```

You can even repeat the same argument several times in the translation:


```javascript
tr.addTranslations({
    "repeat twice ${}": "${0} ${0}"
});

// result will be "zoo zoo"
const translation = tr`repeat twice ${'zoo'}`;
```

### Support for plural form

As translations, you can provide an array. This is useful to support plural
form.

```javascript
tr.addTranslations({
    "${} items": [
        "no item",
        "1 item",
        "${} items"
    ]
});

// print "no item"
console.log(tr`${0} items`);

// print "1 item"
console.log(tr`${1} items`);

// print "42 items"
console.log(tr`${42} items`);
```
If the dynamic argument is a number, its value will be used to select the
correct translation.

You are not limited to numbers, for instance you can also use boolean values:

```javascript
tr.addTranslations({
    "this proposal is ${}": [
        "cette proposition est fausse",
        "cette proposition est vraie"
    ]
});

// print "cette proposition est vraie"
console.log(tr`this proposal is ${true}`);
```

If your template string contains several dynamic arguments, you can use
the ```#``` sign to indicate which one will be used to determine the plural
form (by default, the first one is used):

```javascript
tr.addTranslations({
    "${}: ${#} items": [
        "${}: no item",
        "${}: 1 item",
        "${}: ${} items"
    ]
});

// print "Ref0001: no item"
console.log(tr`${'Ref0001'}: ${0} items`);
```

### Support for formatters

You can register a formatter to be able to use it in a translation.

A formatter is an object with a method named ```format```. This method
will receive the value of the dynamic argument as parameter and will return
the formatted value.

[Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) 
and [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) are compliant with this format.

Use the function ```tr.addFormatter``` to add new named formatter:

```javascript
tr.addFormatter('euros', new Intl.NumberFormat('en', {
    style: 'currency', 
    currency: 'EUR' 
}));

tr.addTranslations({
    '${} euros': '${0:euros}'
})

// print "€1,000.00"
console.log(tr`${1000} euros`);
```

You can reference your formatter in the translation after the position of the 
dynamic argument by using the separator ```:```. If you omit the  position of 
the dynamic parameter, you still have to specify the separator:

```javascript
tr.addTranslations({
    '${} euros': '${:euros}'
})
```

## Loading from the configuration

*TODO*

## Tips and guidelines

*TODO*
