import type { Entity } from '../entityType';

export type BinarySensorEntity = Entity<{
    contact?: boolean;
}>;
