export function
debounce<T = unknown, R = unknown>(func: (...args: T[]) => R, timeout = 300): (args: T) => void {
    let timer: NodeJS.Timeout;
    return (...args: T[]) => {
        const next = () => func(...args);
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(next, timeout > 0 ? timeout : 300);
    };
}

export function clickOutside(node: any):{ destroy(): void; } {
    const handleClick = (event: Event) => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(
                new CustomEvent('click_outside', { detail: event.target }),
            );
        }
    };

    document.addEventListener('click', handleClick, false);

    return {
        destroy() {
            document.removeEventListener('click', handleClick, false);
        },
    };
}

export function componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}

export function rgbToHex(r: number, g: number, b: number): string {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}
