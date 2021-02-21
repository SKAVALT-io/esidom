import type { Entity } from './entityType';

export interface Group {
    groupId?: string;
    name?: string;
    entities: Entity[];
}
