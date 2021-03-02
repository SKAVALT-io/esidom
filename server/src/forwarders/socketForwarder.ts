/* eslint-disable camelcase */
import socketIo from 'socket.io';
import WebSocket from 'ws';
import App from '../app';
import {
    EventObserver,
    Event,
    HaEntityStateChanged,
    HaSocketResult,
    HaSocketError,
    HaEntityUpdated,
} from '../types';
import config from '../config/config';
import { logger } from '../utils';
import { doAuth } from '../index';

type EventType = 'event_type' | 'type';

type HaSocketEvent = {
    // eslint-disable-next-line no-unused-vars
    [x in EventType]: string;
} & {
    data: any;
};

type HaSocket = {
    type: string,
    id: number,
    result?: HaSocketResult,
    event?: HaSocketEvent,
    success?: boolean;
    error?: HaSocketError
}

const SOCKET_TIMEOUT = 10_000;

class SocketForwarder {

    // eslint-disable-next-line no-unused-vars
    private socketsMap: Map<number, (body: any) => void>;

    // eslint-disable-next-line no-unused-vars
    private errorsMap: Map<number, (body: any) => void>;

    private socket: WebSocket | null;

    private uid: number;

    private io: socketIo.Server;

    private observers: EventObserver[];

    private retryConnectId: any = undefined;

    constructor() {
        this.socketsMap = new Map();
        this.errorsMap = new Map();
        this.socket = null;
        this.uid = 2;
        this.observers = [];
        this.io = new socketIo.Server(App.http, {
            cors: {
                origin: '*',
            },
        });
    }

    registerObserver(observer: EventObserver) {
        this.observers.push(observer);
    }

    notifyObservers(event: Event, data?: string) {
        this.observers.forEach((observer: EventObserver) => {
            if (event === 'authOk') {
                observer.onAuthOk?.();
            } else if (data) {
                if (event === 'entityUpdated') {
                    observer.onEntityUpdated?.(data);
                } else if (event === 'entityCreated') {
                    observer.onEntityCreated?.(data);
                } else if (event === 'entityRemoved') {
                    observer.onEntityRemoved?.(data);

                } else if (event === 'deviceUpdated') {
                    observer.onDeviceUpdated?.(data);
                } else if (event === 'deviceRemoved') {
                    observer.onDeviceRemoved?.(data);
                } else if (event === 'deviceCreated') {
                    observer.onDeviceCreated?.(data);

                } else if (event === 'automationUpdated') {
                    observer.onAutomationUpdated?.(data);
                } else if (event === 'automationRemoved') {
                    observer.onAutomationRemoved?.(data);
                } else if (event === 'automationCreated') {
                    observer.onAutomationCreated?.(data);
                } else if (event === 'roomCreated') {
                    observer.onRoomCreated?.(data);
                } else if (event === 'roomUpdated') {
                    observer.onRoomUpdated?.(data);
                } else if (event === 'roomRemoved') {
                    observer.onRoomRemoved?.(data);
                } else if (event === 'groupCreated') {
                    observer.onGroupCreated?.(data);
                } else if (event === 'groupUpdated') {
                    observer.onGroupUpdated?.(data);
                } else if (event === 'groupRemoved') {
                    observer.onGroupRemoved?.(data);
                } else {
                    logger.error(`No such event ${event}`);
                }
            }
        });
    }

    initSocket(token: string): void {
        this.socket = new WebSocket(`ws://${config.baseUrl}/api/websocket`);
        this.socket
            .on('open', () => {
                logger.info('Connected to websocket');
                if (this.retryConnectId) {
                    clearInterval(this.retryConnectId);
                    this.retryConnectId = undefined;
                }
                setTimeout(() => this.subscribeToEvents(), 1000);
            })
            .on('close', () => {
                logger.info('Connection to websocket closed');
                this.retryConnectId = setInterval(() => doAuth(), 10000);
            })
            .on('message', (wsData: WebSocket.Data) => {
                const data = JSON.parse(wsData.toString()) as HaSocket;
                switch (data.type) {
                case 'auth_required':
                    this.socket?.send(
                        JSON.stringify({ type: 'auth', access_token: token }),
                    );
                    break;
                case 'auth_ok':
                    logger.info('Authenticated to websocket');
                    this.notifyObservers('authOk');
                    break;
                case 'event':
                    this.handleSocketEvent(data);
                    break;
                case 'result':
                    this.handleSocketResult(data);
                    break;
                default: break;
                }
            });
    }

    private subscribeToEvents() {
        this.forward<any>({
            type: 'subscribe_events',
            event_type: 'state_changed',
        });

        this.forward<any>({
            type: 'subscribe_events',
            event_type: 'device_registry_updated',
        });

        this.forward({
            type: 'subscribe_events',
            event_type: 'entity_registry_updated',
        });

        this.forward({
            type: 'subscribe_events',
            event_type: 'area_registry_updated',
        });
    }

    handleSocketResult(data: HaSocket): void {
        const { id } = data;
        logger.silly(`Received result for ws ${id}`);
        if (data.success === true) {
            logger.silly('Data: ', data.result);
            (this.socketsMap.get(id) || logger.error)(data.result);
        } else if (data.success === false) {
            logger.error(`${data.error?.code} ${data.error?.message}`);
            (this.errorsMap.get(id) || logger.error)(data.error);
        }
        this.socketsMap.delete(id);
        this.errorsMap.delete(id);
    }

    async handleSocketEvent(data: HaSocket): Promise<void> {
        const eventType: string | undefined = data?.event?.event_type ?? data?.event?.type;
        if (!eventType) {
            return;
        }
        logger.debug(`Received WS event : ${eventType}`);
        const eventData: any = data?.event?.data;
        logger.silly('Data: ', eventData);
        if (eventType === 'device_registry_updated') {
            this.handleDeviceRegistryUpdated(eventData, eventType);
        }
        if (eventType === 'state_changed') {
            this.handleStateChanged(eventData);
        }
        if (eventType === 'area_registry_updated') {
            this.handleAreaRegistryUpdated(eventData);
        }
        if (eventType === 'entity_registry_updated') {
            this.handleEntityRegistryUpdated(eventData);
        }
    }

    async getSocketResponse<T>(req: HaSocket): Promise<T> {
        const { id } = req;
        return Promise.race([
            new Promise<T>((res, rej) => {
                this.socketsMap.set(id, res);
                this.errorsMap.set(id, rej);
                this.socket?.send(JSON.stringify(req));
            }),
            new Promise<T>((_resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('Timed out.'));
                }, SOCKET_TIMEOUT);
            }),
        ]);
    }

    async forward<T>(body: any): Promise<T> {
        const data: HaSocket = { id: this.uid++, ...body };
        return this.getSocketResponse<T>(data);
    }

    emitSocket<T>(event: Event, data: T): void {
        logger.debug(`Emit ${event} socket with data:`, data);
        this.io.emit(event, data);
    }

    private handleDeviceRegistryUpdated(eventData: any, eventType: string) {
        switch (eventData?.action) {
        case 'create':
            this.notifyObservers('deviceCreated', eventData.device_id);
            return;
        case 'remove':
            this.notifyObservers('deviceRemoved', eventData);
            return;
        case 'update':
            this.notifyObservers('deviceUpdated', eventData.device_id);
            return;
        default:
            logger.error(`Unknown event ${eventType}`);
        }
    }

    private handleStateChanged(eventData: any) {
        const ent: HaEntityStateChanged = eventData;
        if (ent.entity_id.startsWith('automation')) {
            this.notifyObservers('automationUpdated', ent.entity_id);
        } else if (ent.entity_id.startsWith('group')) {
            let event: Event;
            if (ent.old_state !== null && ent.new_state !== null) {
                event = 'groupUpdated';
            } else if (ent.old_state === null && ent.new_state !== null) {
                event = 'groupCreated';
            } else {
                event = 'groupRemoved';
            }
            console.log(event);
            this.notifyObservers(event, ent.entity_id);
        } else {
            this.notifyObservers('entityUpdated', ent.entity_id);
        }
    }

    private handleAreaRegistryUpdated(eventData: any) {
        if (eventData?.action === 'remove') {
            this.notifyObservers('roomRemoved', eventData?.area_id);
        } else if (eventData?.action === 'update') {
            this.notifyObservers('roomUpdated', eventData?.area_id);
        } else if (eventData?.action === 'create') {
            this.notifyObservers('roomCreated', eventData?.area_id);
        }
    }

    private handleEntityRegistryUpdated(eventData: any) {
        const updated: HaEntityUpdated = eventData;
        if (updated.action === 'remove') {
            if (updated.entity_id.startsWith('automation')) {
                this.notifyObservers('automationRemoved', updated.entity_id);
            } else {
                this.notifyObservers('entityRemoved', updated.entity_id);
            }
        } else if (updated.action === 'create') {
            if (updated.entity_id.startsWith('automation')) {
                this.notifyObservers('automationCreated', updated.entity_id);
            } else {
                this.notifyObservers('entityCreated', updated.entity_id);
            }
        }
    }

}

export default new SocketForwarder();
