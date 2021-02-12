import { Entity } from './entity';

export interface Group {
    groupId: string;
    name: string;
    entities: Entity[];
}
