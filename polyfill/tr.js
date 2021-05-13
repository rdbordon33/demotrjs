function tr(strings, ...args) {
    if (!Array.isArray(strings)) {
        if (typeof strings !== 'string') {
            strings = String(strings);
        }
        strings = strings.split('${}');
    }
    const result = new Array(strings.length + args.length);
    for (let i = 0; i < args.length; ++i) {
        result[i * 2] = strings[i];
        result[(i * 2) + 1] = args[i];
    }
    result[result.length - 1] = strings[strings.length - 1];
    return result.join('');
}

export default tr;