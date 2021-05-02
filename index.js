const trSymbol = Symbol();

function assemble(strings, args) {
    const result = [strings[0]];
    for(let i = 0; i < args.length; ++i) {
        result.push(args[i]);
        result.push(strings[i + 1]);
    }
    return result.join('');
}

function assembleMessageKey(strings, args) {
    const result = [strings[0]];
    for(let i = 0; i < args.length; ++i) {
        result.push("${" + i + "}");
        result.push(strings[i + 1]);
    }
    return result.join('');
}    

function tr(strings, ...args) {
    const translatedMessage = tr[trSymbol][assembleMessageKey(strings, args)];
    if (! translatedMessage) {
        return assemble(strings, args);
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