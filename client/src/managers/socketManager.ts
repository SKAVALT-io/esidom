/* eslint-disable camelcase */
import { io } from 'socket.io-client';
import config from '../config/config';

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

class SocketManager {
    private socket: any;

    connect() {
        this.socket = io(config.BASE_URL);
        console.log('Connected to WS');
    }

    registerListenerById<T>(name: string, id: string, func: (data: EntityDataChanged<T>) => void) {
        this.socket.on(name, (data: EntityDataChanged<T> | SocketError) => {
            if (isSocketError(data)) {
                console.log(`Error on event ${name}. Result: ${JSON.stringify(data)}`);
                return;
            }
            if ((data as EntityDataChanged<T>).id === id) {
                func(data);
            }
        });
    }

    registerGlobalListener(name: string, func: (data: any) => void) {
        this.socket.on(name, (data: SocketError | any) => {
            if (isSocketError(data)) {
                console.log(`Error on event ${name}. Result: ${data}`);
                return;
            }
            func(data);
        });
    }

    removeListener<T>(name: string, func: (data: T) => void) {
        this.socket.off(name, func);
    }
}

export const socketManager = new SocketManager();
