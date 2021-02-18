/* eslint-disable camelcase */
import type { Entity } from '../entityType';

export type LightEntity = Entity<{
    friendly_name: string;
    rgb_color?: [number, number, number];
    hs_color?: [number, number];
    xy_color?: [number, number];
    // Goes between 0 and 255
    brightness: number;
    // Goes between 153 and 500
    color_temp?: number;
}>;
