export function
debounce<T = unknown, R = unknown>(func: (args?: T) => R, timeout = 300): (args?: T) => void {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
        const next = () => func(...args);
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(next, timeout > 0 ? timeout : 300);
    };
}

export const test = 4;
