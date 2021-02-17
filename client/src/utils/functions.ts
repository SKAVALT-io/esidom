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
