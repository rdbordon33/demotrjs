const trSymbol = Symbol();

function assemble(strings, args) {
    const result = [strings[0]];
    for (let i = 0; i < args.length; ++i) {
        result.push(args[i]);
        result.push(strings[i + 1]);
    }
    return result.join('');
}

function tr(strings, ...args) {
    const translator = tr[trSymbol][Translator.createPattern(strings)];
    return !translator ? assemble(strings, args) : translator.translate(args);
}

tr[trSymbol] = {};

const trSplitRegExp = /\$\{[^\}]*\}/;
const trMatchRegExp = /\$\{([^\}]*)\}/;

class Translator {
    constructor(sentence, translation) {
        this.sentences = sentence.split(trSplitRegExp);
        if (typeof translation === 'string') {
            const tokens = translation.split(trMatchRegExp);
            this.strings = tokens.filter((_, i) => !(i % 2));
            this.argDescriptions = tokens.filter((_, i) => i % 2).map(v => parseInt(v));
        } else if (Array.isArray(translation)) {
            this.pluralForms = new Array(translation.length);
            for (let i = 0; i < this.pluralForms.length; ++i) {
                const tokens = translation[i].split(trMatchRegExp);
                this.pluralForms[i] = {
                    strings: tokens.filter((_, i) => !(i % 2)),
                    argDescriptions: tokens.filter((_, i) => i % 2).map(v => parseInt(v))
                }
            }
        }
    }

    static createPattern(strings) {
        return strings.join('${}');
    }

    get pattern() {
        return Translator.createPattern(this.sentences);
    }

    getInfo(args) {
        if (this.pluralForms) {
            const value = (typeof args[0] === "number") ? args[0] : (args[0] ? 1 : 0);
            return this.pluralForms[Math.min(Math.max(0, value), this.pluralForms.length - 1)];
        }
        return this;
    }

    translate(args) {
        const info = this.getInfo(args);
        if (info.argDescriptions) {
            const newArgs = new Array(info.argDescriptions.length);
            for (let i = 0; i < newArgs.length; ++i) {
                newArgs[i] = args[info.argDescriptions[i]];
            }
            return assemble(info.strings, newArgs);
        }
        return assemble(info.strings, args);
    }
}

tr.append = function (translations) {
    for (const key in translations) {
        const translator = new Translator(key, translations[key])
        tr[trSymbol][translator.pattern] = translator;
    }
}

export default tr;