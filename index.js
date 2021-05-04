const trSymbol = Symbol();

function assemble(strings, args) {
    const result = [strings[0]];
    for(let i = 0; i < args.length; ++i) {
        result.push(args[i]);
        result.push(strings[i + 1]);
    }
    return result.join('');
}

function tr(strings, ...args) {
    const translation = tr[trSymbol][Translator.createPattern(strings)];
    if (! translation) {
        return assemble(strings, args);
    } else {
        return translation.translate(args);
    }    
}    

tr[trSymbol] = {};

const trMatchRegExp = /\$\{([^\}]*)\}/g
const trSplitRegExp = /\$\{[^\}]*\}/

class Translator {
    constructor(sentence, translation) {
        this.sentences = sentence.split(trSplitRegExp);
        if (typeof translation === 'string') {
            this.strings = translation.split(trSplitRegExp);
            const groups = translation.match(trMatchRegExp);
            if (groups) {
                this.argDescriptions = groups.slice(1);
            }
        }
    }

    static createPattern(strings) {
        return strings.join('{}');
    }

    get pattern() {
        return Translator.createPattern(this.sentences);
    }

    translate(args) {
        return assemble(this.strings, args);
    }
}

tr.append = function(translations) {
    for (const key in translations) {
        const translator = new Translator(key, translations[key])
        tr[trSymbol][translator.pattern] = translator;
    }
}

export default tr;