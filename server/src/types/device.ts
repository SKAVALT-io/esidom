/* eslint-disable camelcase */
import { Automation } from './automation';
import { Entity } from './entity';

export interface Device {
    id: string;
    name: string;
    model: string;
    entities: Array<Entity>;
    automations: Array<Automation>;
}

export interface HaDevice {
    id: string;
    name: string;
    connections: { connection_type: string, connection_identifier: string }[];
    identifiers: (string[])[];
    manufacturer: string;
    model: string;
    config_entries: string[];
    sw_version: string;
    via_device_id: string;
    area_id: string;
    entry_type: string | null; // only "service" or null
    name_by_user: string;
    disabled_by: string;
}
