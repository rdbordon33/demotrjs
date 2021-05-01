const trSymbol = Symbol();

function assemble(strings, ...args) {
    for(let i = 0; i < args.length; ++i) {
        strings.splice(2 * i + 1, 0, args[i]);
    }    
    return strings.join('');
}    

const tr = function(strings, ...args) {
    const msg = strings.join('${}');
    const translatedMessage = tr[trSymbol][msg];
    if (! translatedMessage) {
        return assemble([...strings], args);
    } else {
        return assemble(translatedMessage, args);
    }    
}    

tr[trSymbol] = {};

tr.append = function(translations) {
    Object.assign(tr[trSymbol], translations);
    for (const key in translations) {
        tr[trSymbol][key] = tr[trSymbol][key].split(/\$\{\d+\}/);
    }
}

export default tr;