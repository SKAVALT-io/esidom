/* eslint-disable camelcase */
export interface Entity {
    id: string;
    entityId: string;
    name: string;
    type: string;
    model: string;
    data: any[];
}

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
