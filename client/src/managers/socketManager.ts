/* eslint-disable camelcase */
import { io } from 'socket.io-client';
import config from '../config/config';
import { debounce } from '../utils/functions';
import toastService from '../utils/toast';

// export interface EntityDataChanged<T> {
//     entity_id: string;
//     new_state: T;
//     old_state: T;
// }

export interface EntityDataChanged<T> {
    name: string;
    id: string;
    state: string;
    type: string;
    attributes: T;
}

type SocketError = { error: string };
function isSocketError(data: any): data is SocketError {
    return 'error' in data;
}

// Need to fix the debounce function generic types...
const toastError: (name: string|SocketError, data: string|SocketError) => void = debounce(
    (name: string|SocketError, data: string|SocketError) => toastService.toast(`Error on event ${name}: ${JSON.stringify(data)}`, 'error'),
);

class SocketManager {
    private socket: any;

    connect() {
        this.socket = io(config.BASE_URL, {
            path: config.WS_PATH,
        });
        console.log('Connected to WS');
    }

    // Need these 2 maps because we need to store the function
    // or else we can't remove the listener correctly
    private funcToListenerById = new Map();

    private funcToGlobalListener = new Map();

    registerListenerById<T>(name: string, id: string, func: (data: EntityDataChanged<T>) => void) {
        const f = (data: EntityDataChanged<T> | SocketError) => {
            if (isSocketError(data)) {
                toastError(name, data.error);
                return;
            }
            if ((data as EntityDataChanged<T>).id === id) {
                func(data);
            }
        };

        this.funcToListenerById.set(func, f);
        this.socket.on(name, f);
    }

    registerGlobalListener<T>(name: string, func: (data: T) => void) {
        const f = (data: SocketError | T) => {
            if (isSocketError(data)) {
                toastError(name, data.error);
                return;
            }
            func(data);
        };

        this.funcToGlobalListener.set(func, f);
        this.socket.on(name, f);
    }

    removeListener<T>(name: string, func: (data: T) => void) {
        if (this.funcToGlobalListener.has(func)) {
            this.socket.off(name, this.funcToGlobalListener.get(func));
        } else {
            this.socket.off(name, this.funcToListenerById.get(func));
        }
    }
}

export const socketManager = new SocketManager();
