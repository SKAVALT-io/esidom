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

class SocketManager {
    private socket: any;

    connect() {
        this.socket = io(config.BASE_URL);
        console.log('Connected to WS');
    }

    registerListener<T>(name: string, id: string, func: (data: EntityDataChanged<T>) => void) {
        this.socket.on(name, (data: EntityDataChanged<T>) => {
            // console.log(data);
            // console.log(data.id, id);
            if (data.id === id) {
                func(data);
            }
        });
    }

    registerPairListener(name: string, func: (data: any) => void) {
        this.socket.on(name, (data: any) => {
            // console.log(data.id, id);
            func(data);
        });
    }

    removeListener<T>(name: string, func: (data: T) => void) {
        this.socket.off(name, func);
    }
}

export const socketManager = new SocketManager();
