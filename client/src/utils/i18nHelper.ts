import { _ } from 'svelte-i18n';

export function format(src: string, ...args: string[]): string {
    return src.replace(/{(\d*)}/gi, (a: string, b: number) => args[b]);
}

// Load the i18n function
let trHelper: (a: string) => string | string[];
_.subscribe((a) => (trHelper = a));

// Prefer to use 'text-transform: capitalize' css attribute for capitalization
export function tr(a: string, capitalize = false): string {
    try {
        const cap = capitalize
            ? (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
            : (s: string) => s;
        return cap(trHelper(a) as string);
    } catch (err) {
        return 'A venir';
    }
}

export function trArray(a: string, separator = '<br/>', capitalize = false): string {
    try {
        const cap = capitalize
            ? (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
            : (s: string) => s;
        return cap((trHelper(a) as string[]).join(separator));
    } catch (err) {
        return 'A venir';
    }
}
