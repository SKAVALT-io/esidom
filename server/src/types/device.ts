import { Entity } from './entity';

export interface Device {
    id: string;
    name: string;
    type: string;
    model: string;
    entities: Array<Entity>;
}
