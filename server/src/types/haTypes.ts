/* eslint-disable camelcase */


// Specifies the object structure returned by HA
// when calling { type: 'config/device_registry/list' }
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

// Specifies the object structure returned by HA
// when calling { type: 'config/entity_registry/list' }
export interface HaEntity {
    config_entry_id: string;
    device_id: string;
    area_id: string;
    disabled_by: string;
    entity_id: string;
    name: string;
    icon: string;
    platform: string;
}

export interface HaStateResponse {
    entity_id: string;
    state: string;
    attributes: any; // specific to the entity
    last_changed: string;
    last_updated: string;
    context: {
        id: string;
        parent_id: string;
        user_id: string;
    };
}