/* eslint-disable camelcase */
import { Automation } from './automation';
import { Entity } from './entity';

export interface Device {
    id: string;
    name: string;
    model: string;
    entities: Entity[];
    automations: Automation[];
    nameByUser?: string;
    disabledBy?: string;
    areaId?: string;
}
// get everything with { type: 'config/device_registry/list' }
// except for entities and automations
