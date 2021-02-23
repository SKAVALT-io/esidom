import { Entity } from './entity';
import { Room } from './room';

export interface Group {
    groupId: string;
    name: string;
    entities: Entity[];
    implicit: boolean;
    room?: Room;
    type?:string;
    state: string;
}
