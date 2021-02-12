export interface DBGroup {
    entityId: string;
    name: string;
}

export interface AccessEntity {
    entityId: string;
    userId: string;
}

export interface InsideGroup {
    entityId: string;
    groupEntityId: string;
}
