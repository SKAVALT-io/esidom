import { Request, Response } from 'express';
import { config } from "../config/config";
import WebSocket from 'ws';
// const io = new socketIo.Server(http, {
//     cors: {
//         origin: '*',
//     }
// });

type HaSocket = {
    type: string,
    id: number,
    result?: any,
    event?: any,
}

class SocketForwarder {
    socketsMap: Map<number, (body: any) => void>;
    socket: WebSocket | null;
    uid: number;

    constructor() {
        this.socketsMap = new Map<number, (a: any) => void>();
        this.socket = null;
        this.uid = 2;
    }

    initSocket(token: string): void {
        this.socket = new WebSocket(`ws://${config.baseUrl}/api/websocket`);
        this.socket.on('open', () => {
            console.log('connected to websocket');
        })
            .on('close', () => {
                console.log('connection to websocket closed');
            })
            .on('message', (wsData: WebSocket.Data) => {
                const data = JSON.parse(wsData.toString()) as HaSocket;
                switch (data.type) {
                case 'auth_required':
                    this.socket?.send(
                        JSON.stringify({ type: 'auth', access_token: token})
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

    handleSocketResult(data: HaSocket): void {
        const { id } = data;
        console.log(`received result for ws ${data.id}`);
        console.log(data.result);
        (this.socketsMap.get(id) || console.log)(data.result);
        this.socketsMap.delete(id);
    }

    handleSocketEvent(data: HaSocket): void {
        const { id } = data;
        console.log(`received event for ws : ${id}`);
        if (data.event.event_type === 'device_registry_updated') {
            console.log(data.event.data);
            if (data.event.data.action === 'create') {
                (this.socketsMap.get(id) || console.log)(data.event.data);
                this.socketsMap.delete(id);
                // io.emit('device_created', data.event.data);
            }
            if (data.event.data.action === 'remove') {
                // io.emit('device_removed', data.event.data);
            } else {
                console.log(`Unknown event ${data.event.event_type}`);
            }
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
    
    async forward(body: any): Promise<any> {
        const data: HaSocket = { id: this.uid++, ...body };
        const res: any = await this.getSocketResponse(data);
        return res;
    }
}


export const socketForwarder = new SocketForwarder();