const trSymbol = Symbol();

function assemble(strings, args) {
    const result = new Array(strings.length + args.length);
    for (let i = 0; i < args.length; ++i) {
        result[i * 2] = strings[i];
        result[(i * 2) + 1] = args[i];
    }
    result[result.length - 1] = strings[strings.length - 1];
    return result.join('');
}

function tr(strings, ...args) {
    const translator = tr[trSymbol][Translator.createPattern(strings)];
    return !translator ? assemble(strings, args) : translator.translate(args);
}

tr[trSymbol] = {};

const argRegExp = /\$\{\s*([^\}]*)\s*\}/;

class ArgDescriptor {
    constructor(description, defaultPosition) {
        this.position = parseInt(description);
        if(isNaN(this.position)) {
            this.position = defaultPosition;
        }
        if (description === '#') {
            this.pluralValue = true;
        }
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
        }
    }

    parsePattern(pattern) {
        const tokens = pattern.split(argRegExp);
        return {
            strings: tokens.filter((_, i) => !(i % 2)),
            argDescriptions: tokens.filter((_, i) => i % 2).map((v, i) => new ArgDescriptor(v, i))
        };
    }

    static createPattern(strings) {
        return strings.join('${}');
    }

    get pattern() {
        return Translator.createPattern(this.sentence.strings);
    }

    get pluralValueArgumentIndex() {
        for (let i = 0; i < this.sentence.argDescriptions.length; ++i) {
            if (this.sentence.argDescriptions[i].pluralValue) {
                return i;
            }
        }
        return 0;
    }

    getInfo(args) {
        if (this.translations) {
            const pluralValue = args[this.pluralValueArgumentIndex];
            const value = (typeof pluralValue === "number") ? pluralValue : (pluralValue ? 1 : 0);
            return this.translations[Math.min(Math.max(0, value), this.translations.length - 1)];
        }
        return this.translation;
    }

    translate(args) {
        const info = this.getInfo(args);
        const newArgs = new Array(info.argDescriptions.length);
        for (let i = 0; i < newArgs.length; ++i) {
            newArgs[i] = args[info.argDescriptions[i].position];
        }
        return assemble(info.strings, newArgs);
    }
}

tr.append = function (translations) {
    for (const key in translations) {
        const translator = new Translator(key, translations[key])
        tr[trSymbol][translator.pattern] = translator;
    }
}

export default tr;