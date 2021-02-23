/* eslint-disable camelcase */
import socketIo from 'socket.io';
import WebSocket from 'ws';
import { HaEntityUpdated, HaSocketResult, HaSocketError } from '../types/haTypes';
import App from '../app';
import config from '../config/config';
import { EventObserver, Event } from '../types/observer';

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
                } else if (event === 'automationUpdated') {
                    observer.onAutomationUpdated?.(data);
                } else if (event === 'deviceRegistryUpdated') {
                    observer.onDeviceRegistryUpdated?.(data);
                } else if (event === 'entityRegistryUpdated') {
                    observer.onEntityRegistryUpdated?.();
                } else if (event === 'areaUpdated') {
                    observer.onAreaUpdated?.(data);
                } else if (event === 'areaRemoved') {
                    observer.onAreaRemoved?.(data);
                } else {
                    console.log(`No such event ${event}`);
                }
            }
        });
    }

    initSocket(token: string): void {
        this.socket = new WebSocket(`ws://${config.baseUrl}/api/websocket`);
        this.socket
            .on('open', () => {
                console.log('connected to websocket');
                setTimeout(() => this.subscribeToEvents(), 1000);
            })
            .on('close', () => {
                console.log('connection to websocket closed');
                // TODO: try reconnecting to HA
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
                    console.log('Authorized');
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
        console.log(`received result for ws ${id}`);
        if (data.success === true) {
            // console.log(data.result);
            (this.socketsMap.get(id) || console.log)(data.result);
        } else if (data.success === false) {
            console.log(`${data.error?.code} ${data.error?.message}`);
            (this.errorsMap.get(id) || console.log)(data.error);
        }
        this.socketsMap.delete(id);
        this.errorsMap.delete(id);
    }

    async handleSocketEvent(data: HaSocket): Promise<void> {
        const { id } = data;
        const eventType: string | undefined = data?.event?.event_type ?? data?.event?.type;
        if (!eventType) {
            return;
        }
        console.log(`received WS event : ${eventType}`);
        const eventData: any = data?.event?.data;
        if (eventType === 'device_registry_updated') {
            this.handleDeviceRegistryUpdated(eventData, eventType);
        }
        if (eventType === 'state_changed') {
            this.handleStateChanged(eventData);
        }
        if (eventType === 'area_registry_updated') {
            this.handleAreaRegistryUpdated(eventData);
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

    emitSocket<T>(event: string, data: T): void {
        this.io.emit(event, data);
    }

    private handleDeviceRegistryUpdated(eventData: any, eventType: string) {
        console.log(eventData);
        switch (eventData?.action) {
        case 'create':
            this.notifyObservers('deviceRegistryUpdated', eventData.device_id);
            return;
        case 'remove':
            this.io.emit('device_removed', eventData);
            return;
        case 'update':
            this.notifyObservers('deviceRegistryUpdated');
            return;
        default:
            console.log(`Unknown event ${eventType}`);
        }
    }

    private handleStateChanged(eventData: any) {
        const ent: HaEntityUpdated = eventData;
        if (ent.entity_id.startsWith('automation')) {
            this.notifyObservers('automationUpdated', ent.entity_id);
        } else {
            this.notifyObservers('entityUpdated', ent.entity_id);
        }
    }

    private handleAreaRegistryUpdated(eventData: any) {
        if (eventData?.action === 'remove') {
            this.notifyObservers('areaRemoved', eventData?.area_id);
        } else if (eventData?.action === 'update') {
            this.notifyObservers('areaUpdated', eventData?.area_id);
        }
    }

}

export default new SocketForwarder();
