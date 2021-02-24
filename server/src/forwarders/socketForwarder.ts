import socketIo from 'socket.io';
import WebSocket from 'ws';
import { HaEntityUpdated } from '../types/haTypes';
import App from '../app';
import config from '../config/config';
import { EventObserver, Event } from '../types/observer';

type HaSocket = {
    type: string,
    id: number,
    result?: any,
    event?: any,
    success?: boolean;
    error?: {
        code: string;
        message: string;
    }
}

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
            switch (event) {
            case 'authOk':
                observer.onAuthOk?.();
                break;
            case 'entityUpdated':
                if (data) {
                    observer.onEntityUpdated?.(data);
                }
                break;
            case 'automationUpdated':
                if (data) {
                    observer.onAutomationUpdated?.(data);
                }
                break;
            case 'deviceRegistryUpdated':
                if (data) {
                    observer.onDeviceRegistryUpdated?.(data);
                }
                break;
            case 'entityRegistryUpdated':
                observer.onEntityRegistryUpdated?.();
                break;
            case 'areaUpdated':
                if (data) {
                    // It's a trick to wait for all the entities of an device to be loaded
                    setTimeout(() => observer.onAreaUpdated?.(data), 500);
                }
                break;
            case 'areaRemoved':
                if (data) {
                    observer.onAreaRemoved?.(data);
                }
                break;
            default:
                console.log(`No such event ${event}`);
                break;
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
        console.log(`received event for ws : ${id}`);
        // console.log(data);
        const eventType: string = data?.event?.event_type;
        if (eventType === 'device_registry_updated') {
            console.log(data.event.data);
            switch (data?.event?.data?.action) {
            case 'create':
                (this.socketsMap.get(id) || console.log)(data.event.data);
                this.socketsMap.delete(id);
                this.notifyObservers('deviceRegistryUpdated', data.event.data.device_id);
                return;
            case 'remove':
                this.io.emit('device_removed', data.event.data);
                return;
            case 'update':
                this.notifyObservers('deviceRegistryUpdated', data.event.data.device_id);
                return;
            default:
                console.log(`Unknown event ${data.event.event_type}`);
                return;
            }
        }
        if (eventType === 'state_changed') {
            const ent: HaEntityUpdated = data?.event?.data;
            if (ent.entity_id.startsWith('automation')) {
                this.notifyObservers('automationUpdated', ent.entity_id);
            } else {
                this.notifyObservers('entityUpdated', ent.entity_id);
            }
        }
        if (eventType === 'area_registry_updated') {
            if (data?.event?.data?.action === 'remove') {
                this.notifyObservers('areaRemoved', data.event?.data?.area_id);
            } else if (data?.event?.data?.action === 'update') {
                this.notifyObservers('areaUpdated', data.event?.data?.area_id);
            }
        }
    }

    async getSocketResponse(req: HaSocket): Promise<any> {
        const { id } = req;
        const result = await new Promise((res, rej) => {
            this.socketsMap.set(id, res);
            this.errorsMap.set(id, rej);
            this.socket?.send(JSON.stringify(req));
        });
        return result;
    }

    async forward<T>(body: any): Promise<T> {
        const data: HaSocket = { id: this.uid++, ...body };
        const res: any = await this.getSocketResponse(data);
        return res;
    }

    emitSocket<T>(event: string, data: T): void {
        this.io.emit(event, data);
    }

}

export default new SocketForwarder();
