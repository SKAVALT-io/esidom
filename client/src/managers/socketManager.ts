/* eslint-disable camelcase */
import { io } from 'socket.io-client';
import config from 'src/config/config';

export interface EntityDataChanged<T> {
    entity_id: string;
    new_state: T;
    old_state: T;
}

class SocketManager {
    private socket: any;

    connect() {
        this.socket = io(config.BASE_URL);
        console.log('Connected to WS');
    }

    registerListener<T>(name: string, id: string, func: (data: T) => void) {
        this.socket.on(name, (data: EntityDataChanged<T>) => {
            if (data.entity_id === id) {
                func(data.new_state);
            }
        });
    }

    removeListener<T>(name: string, func: (data: T) => void) {
        this.socket.off(name, func);
    }
}

export const socketManager = new SocketManager();
