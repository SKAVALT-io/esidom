export type Entity<T> = {
    id: string;
    name: string;
    type: string;
    state: string;
    message?: string;
    attributes: T;
}
