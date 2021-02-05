import socketIo from 'socket.io';
import WebSocket from 'ws';
import App from '../app';
import config from '../config/config';

type HaSocket = {
    type: string,
    id: number,
    result?: any,
    event?: any,
}

class SocketForwarder {

    // eslint-disable-next-line no-unused-vars
    private socketsMap: Map<number, (body: any) => void>;

    private socket: WebSocket | null;

    private uid: number;

    private io: socketIo.Server;

    constructor() {
        this.socketsMap = new Map();
        this.socket = null;
        this.uid = 2;
        this.io = new socketIo.Server(App.http, {
            cors: {
                origin: '*',
            },
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
            id: this.uid++,
        });
    }

    handleSocketResult(data: HaSocket): void {
        const { id } = data;
        console.log(`received result for ws ${id}`);
        console.log(data.result);
        (this.socketsMap.get(id) || console.log)(data.result);
        this.socketsMap.delete(id);
    }

    handleSocketEvent(data: HaSocket): void {
        const { id } = data;
        console.log(`received event for ws : ${id}`);
        if (data.event.event_type === 'device_registry_updated') {
            console.log(data.event.data);
            switch (data?.event?.data?.action) {
            case 'create':
                (this.socketsMap.get(id) || console.log)(data.event.data);
                this.socketsMap.delete(id);
                this.io.emit('device_created', data.event.data);
                return;
            case 'remove':
                this.io.emit('device_removed', data.event.data);
                return;
            default:
                console.log(`Unknown event ${data.event.event_type}`);
                return;
            }
        }
        if (data?.event?.event_type === 'state_changed') {
            console.log(`state changed : ${JSON.stringify(data.event.data)}`);
            this.io.emit('entity_updated', data?.event?.data);
        }
    }

    async getSocketResponse(req: HaSocket): Promise<any> {
        const { id } = req;
        const result = await new Promise((res, rej) => {
            this.socketsMap.set(id, res);
            this.socket?.send(JSON.stringify(req));
        });
        return result;
    }

    async forward<T>(body: any): Promise<T> {
        const data: HaSocket = { id: this.uid++, ...body };
        const res: any = await this.getSocketResponse(data);
        return res;
    }

}

export default new SocketForwarder();
