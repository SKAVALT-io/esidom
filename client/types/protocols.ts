export type Status = { status: 'ok'} | { status: 'failed', error: string };
export type Protocols = { [protocol:string] : Status };
