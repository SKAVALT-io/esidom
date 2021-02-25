import { Readable, writable } from 'svelte/store';

interface ToastWritable extends Readable<{msg: string; _id: number}> {
    toast: (msg: string) => void;
}

function createCount(): ToastWritable {
    const { subscribe, update } = writable({ msg: '', _id: 0 });
    let id = 0;

    return {
        subscribe,
        toast: (msg: string) => {
            update(() => ({ msg, _id: id++ }));
        },
    };
}

const toastService = createCount();

export default toastService;
