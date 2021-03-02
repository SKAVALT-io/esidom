export interface User {
    id: string;
    username: string;
    admin: boolean;
    entities: string[];
}

export interface UserWithoutId {
    username: string;
    admin: boolean;
    entities?: string[];
}
