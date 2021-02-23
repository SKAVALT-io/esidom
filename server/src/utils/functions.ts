import { Response } from 'express';

/**
 * Use this to be able to type res.send() in express
 */
export function send<T>(res: Response, status: number, body?: T): Response<T> {
    return (res as Response<T>).status(status).send(body);
}

/**
 * Use this to be able to type res.send in express, function-chaining version
 */
export function sendf<T>(res: Response, status: number): (data: T) => Response<T> {
    return (data: T) => (res as Response<T>).status(status).send(data);
}

export const MISSING_PARAM = (name: string): string => `Missing parameter ${name}`;

export const NO_SUCH_ID = (id: string): string => `No entity with such id: ${id}`;
