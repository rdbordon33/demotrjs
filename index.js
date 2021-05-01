function assemble(strings, ...args) {
    for(let i = 0; i < args.length; ++i) {
        strings.splice(2 * i + 1, 0, args[i]);
    }
    return strings.join('');
}

const tr = function(strings, ...args) {
    const msg = strings.join('${}');
    const translatedMessage = tr._translations[msg];
    if (! translatedMessage) {
        return assemble([...strings], args);
    } else {
        return assemble(translatedMessage, args);
    }
}

tr._translations = {};

tr.append = function(translations) {
    Object.assign(tr._translations, translations);
    for (const key in translations) {
        tr._translations[key] = tr._translations[key].split(/\$\{\d+\}/);
    }
}

export default tr;