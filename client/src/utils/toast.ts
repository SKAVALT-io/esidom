import { Readable, writable } from 'svelte/store';
import type { ToastMessage } from '../../types/toastMessage';

interface ToastWritable extends Readable<ToastMessage> {
    toast: (msg: string, type?: 'info' | 'error') => void;
}

function createCount(): ToastWritable {
    const { subscribe, update } = writable({ msg: '', _id: 0, type: 'info' });
    let id = 0;

    return {
        subscribe,
        toast: (msg: string, type?: 'info' | 'error') => {
            update(() => ({ msg, _id: id++, type: type || 'info' }));
        },
    };
}

const toastService = createCount();

export default toastService;
