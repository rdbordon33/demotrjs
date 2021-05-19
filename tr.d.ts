export default tr;
/**
 * tr can be used as a function or a tag function of template literals.
 *
 * As a function, the first parameter is the template with dynamic parameters indicated by ${}.
 * The remaining parameters are the values for the dynamic parameters.
 * @param {(any|string[])} strings
 * @param  {...any} args
 * @returns {string} The translation
 */
declare function tr(strings: (any | string[]), ...args: any[]): string;
declare namespace tr {
    function addTranslations(translations: any): void;
    function addFormatter(name: string, formatter: any): void;
    function load(config: any): void;
    function clear(): void;
}
