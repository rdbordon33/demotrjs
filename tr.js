const trSymbol = Symbol();
const ftSymbol = Symbol();
const argRegExp = /\$\{\s*([^\}]*)\s*\}/;
const argPlaceholder = '${}';

function assemble(strings, args) {
    const maxArgs = Math.min(args.length, strings.length - 1);
    const result = new Array(strings.length + maxArgs);
    for (let i = 0; i < maxArgs; ++i) {
        result[i * 2] = strings[i];
        result[(i * 2) + 1] = args[i];
    }
    result[result.length - 1] = strings[strings.length - 1];
    return result.join('');
}

function tr(strings, ...args) {
    if (Array.isArray(strings)) {
        const translator = tr[trSymbol][Translator.createPattern(strings)];
        return translator ? translator.translate(args) : assemble(strings, args);
    } else {
        if (typeof strings !== 'string') {
            strings = String(strings);
        }
        const translator = tr[trSymbol][strings];
        return translator ? translator.translate(args) : assemble(strings.split(argPlaceholder), args);
    }
}

class ArgDescriptor {
    constructor(description, defaultPosition) {
        this.position = parseInt(description);
        if (isNaN(this.position)) {
            this.position = defaultPosition;
        }
        if (description === '#') {
            this.pluralValue = true;
        }
        const separatorIndex = description.indexOf(':');
        if (separatorIndex >= 0) {
            this.formatter = description.slice(separatorIndex + 1).trim();
        }
    }

    getValue(args) {
        const formatter = tr[ftSymbol].get(this.formatter);
        const value = args[this.position];
        return formatter ? formatter.format(value) : value;
    }
}

class Translator {
    constructor(sentence, translation) {
        this.sentence = this.parsePattern(sentence);
        if (typeof translation === 'string') {
            this.translation = this.parsePattern(translation);
        } else if (Array.isArray(translation)) {
            this.translations = new Array(translation.length);
            for (let i = 0; i < this.translations.length; ++i) {
                this.translations[i] = this.parsePattern(translation[i]);
            }
        } else {
            this.translation = {
                strings: [String(translation)],
                argDescriptions: []
            }
        }
    }

    static createPattern(strings) {
        return strings.join(argPlaceholder);
    }

    parsePattern(pattern) {
        const tokens = pattern.split(argRegExp);
        return {
            strings: tokens.filter((_, i) => !(i % 2)),
            argDescriptions: tokens.filter((_, i) => i % 2).map((v, i) => new ArgDescriptor(v, i))
        };
    }

    get pattern() {
        return Translator.createPattern(this.sentence.strings);
    }

    get argumentIndexForPlural() {
        for (let i = 0; i < this.sentence.argDescriptions.length; ++i) {
            if (this.sentence.argDescriptions[i].pluralValue) {
                return i;
            }
        }
        return 0;
    }

    getInfo(args) {
        if (this.translations) {
            const indexForPlural = args[this.argumentIndexForPlural];
            const value = (typeof indexForPlural === "number") ? indexForPlural : (indexForPlural ? 1 : 0);
            return this.translations[Math.min(Math.max(0, value), this.translations.length - 1)];
        }
        return this.translation;
    }

    translate(args) {
        const info = this.getInfo(args);
        const newArgs = new Array(info.argDescriptions.length);
        for (let i = 0; i < newArgs.length; ++i) {
            newArgs[i] = info.argDescriptions[i].getValue(args);
        }
        return assemble(info.strings, newArgs);
    }
}

tr.addTranslations = function (translations) {
    for (const key in translations) {
        const translator = new Translator(key, translations[key])
        tr[trSymbol][translator.pattern] = translator;
    }
}

tr.addFormatter = function (name, formatter) {
    if (formatter && typeof formatter.format === 'function') {
        tr[ftSymbol].set(name, formatter);
    }
}

tr.load = function (config) {
    for (const k in config['numberFormats']) {
        tr.addFormatter(k, new Intl.NumberFormat(config['locales'], config['numberFormats'][k]))
    }
    for (const k in config['dateTimeFormats']) {
        tr.addFormatter(k, new Intl.DateTimeFormat(config['locales'], config['dateTimeFormats'][k]))
    }
    tr.addTranslations(config['translations']);
}

tr.clear = function () {
    tr[trSymbol] = {};
    tr[ftSymbol] = new Map();
}

tr.clear();

export default tr;