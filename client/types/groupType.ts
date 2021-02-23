import type { Entity } from './entityType';
import type { Room } from './roomType';

export interface Group {
    groupId?: string;
    name?: string;
    state?: string;
    entities: Entity<any>[];
    implicit: boolean;
    room?: Room;
    type?:string;
}
