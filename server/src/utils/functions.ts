import { Response } from 'express';
import { Logger } from 'tslog';

export const MISSING_PARAM = (name: string): string => `Missing parameter ${name}`;
export const NO_SUCH_ID = (id: string | number): string => `No entity with such id: ${id}`;

export const logger: Logger = new Logger({ name: 'middleLogger', minLevel: 'trace' });

/**
 * Use this to be able to type res.send() in express
 */
export function send<T>(res: Response, status: number, body?: T): Response<T> {
    return (res as Response<T>).status(status).send(body);
}

/**
 * Use this to be able to type res.send in express, function-chaining version
 */
// eslint-disable-next-line no-unused-vars
export function sendf<T>(res: Response, status: number): (data: T) => Response<T> {
    return (data: T) => (res as Response<T>).status(status).send(data);
}

/**
 * Respond with a message as body
 */
export function sendMessage(res: Response, status: number, message: string)
: Response<{ message: string }> {
    return send(res, status, { message });
}

export function sendMissingParam(res: Response, name: string) {
    logger.trace(`Request lacks a path parameter: '${name}'`);
    return send(res, 400, { error: MISSING_PARAM(name) });
}

export function sendNoSuchId(res: Response, id: number | string) {
    logger.trace(`Can't find object with such id: ${id}`);
    return send(res, 404, { error: NO_SUCH_ID(id) });
}

export type SuccessMessage = Promise<Response<{ message: string}>>;

export type SuccessOrError<T> = Promise<Response<T> | Response<{ error: string}>>;

export type SuccessMessageOrError = SuccessOrError<{ message: string }>;

export type Success<T> = Promise<Response<T>>;

export function normalizeEntityId(name: string): string {
    return name.toLowerCase().replace(/ /g, '_');
}
