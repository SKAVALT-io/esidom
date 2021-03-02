/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import Blockly from 'blockly';
import type { Block } from 'blockly';
import { hexToRgb, rgbToHex } from '../../utils/functions';

const esidomGenerator: Blockly.Generator = new Blockly.Generator('ESIDOM');

const PRECEDENCE = 0;

function getWeekday(blk: Block): string[] {
    const checkbox_mon = blk.getFieldValue('Mon') === 'TRUE';
    const checkbox_tue = blk.getFieldValue('Tue') === 'TRUE';
    const checkbox_wed = blk.getFieldValue('Wed') === 'TRUE';
    const checkbox_thu = blk.getFieldValue('Thu') === 'TRUE';
    const checkbox_fri = blk.getFieldValue('Fri') === 'TRUE';
    const checkbox_sat = blk.getFieldValue('Sat') === 'TRUE';
    const checkbox_sun = blk.getFieldValue('Sun') === 'TRUE';

    const weekday = [];
    if (checkbox_mon) { weekday.push('mon'); }
    if (checkbox_tue) { weekday.push('tue'); }
    if (checkbox_wed) { weekday.push('wed'); }
    if (checkbox_thu) { weekday.push('thu'); }
    if (checkbox_fri) { weekday.push('fri'); }
    if (checkbox_sat) { weekday.push('sat'); }
    if (checkbox_sun) { weekday.push('sun'); }

    return weekday;
}

function getDropdownChoice(blk: Block): string {
    const dropdownChoice = blk.getFieldValue('Object');
    return dropdownChoice;
}

interface BlocklyData{
    rgb_color?: number[];
    brightness?: string;
    color_temp?: string;
}

export interface BlocklyJSON {
    trigger?: string;
    condition?: string;
    action?: string;
    mode?: string;
    platform?: string;
    at?: string;
    service?: string;
    entity_id?: string;
    after?: string;
    before?: string;
    weekday?: string[];
    from?: string;
    to?: string;
    state?: string;
    alias?: string;
    after_offset?: string;
    offset?: string;
    event?: string;
    above?: string;
    below?: string;
    attribute?: string;
    data?: BlocklyData;
    delay?: string;
    hours?: string;
    minutes?: string;
    seconds?: string;
    for?: string;
    conditions?: BlocklyJSON[];
}

export type EntityTypeEnum = 'binary_sensor' | 'sensor' | 'light' | 'automation' | 'switch' | 'group';
const types: EntityTypeEnum[] = ['binary_sensor', 'sensor', 'light', 'automation', 'switch', 'group'];

export type BlocksGenerator = {
    [key in EntityTypeEnum]: (a: Block, code: string, opt_thisOnly: string) => void;
} & {
    esidom_automation: (blk: Block) => void;
    binary_trigger: (blk: Block) => void;
    time_trigger: (blk: Block) => void;
    sun_trigger: (blk: Block) => void;
    numeric_state_trigger: (blk: Block) => void;
    interval_trigger: (blk: Block) => void;
    time_condition: (blk: Block) => void;
    sun_condition: (blk: Block) => void;
    time_condition_hour: (blk: Block) => void;
    time_condition_week: (blk: Block) => void;
    binary_condition: (blk: Block) => void;
    numeric_state_condition: (blk: Block) => void;
    action: (blk: Block) => void;
    color_picker: (blk: Block) => void;
    color_rgb: (blk: Block) => void;
    brightness: (blk: Block) => void;
    color_temp: (blk: Block) => void;
    object_action: (blk: Block) => void;
    delay_action: (blk: Block) => void;
    scrub_: (blk: Block, code: string, opt_thisOnly: string) => string;
    jsonInit:(a: Block)=> void;
}

((block: BlocksGenerator) => {
    types.forEach((t: EntityTypeEnum) => {
        block[t] = (blk: Block) => [getDropdownChoice(blk), PRECEDENCE];
    });

    /**
     * Bloc ESIDOM
     */

    block.esidom_automation = (blk: Block) => {
        const statements_trigger: string = esidomGenerator.statementToCode(blk, 'Trigger');
        const statements_condition: string = esidomGenerator.statementToCode(blk, 'Condition');
        const statements_action: string = esidomGenerator.statementToCode(blk, 'Action');

        const json: BlocklyJSON = {};

        if (statements_trigger !== '') {
            const triggers = `[${statements_trigger}]`;
            json.trigger = JSON.parse(triggers);
        }

        if (statements_condition !== '') {
            const conditions = `[${statements_condition}]`;
            json.condition = JSON.parse(conditions);
        }

        if (statements_action !== '') {
            const actions = `[${statements_action}]`;
            json.action = JSON.parse(actions);
        }

        // json.mode = dropdown_mode;
        /*
         * Choose to keep the default value 'single' because the user may
         * not need the others options
         */
        json.mode = 'single';

        return JSON.stringify(json);
    };

    /**
     * Catégorie Déclencheur
     */

    block.time_trigger = (blk: Block) => {
        const number_hour = blk.getFieldValue('Hour');
        const number_minute = blk.getFieldValue('Minute');
        const number_second = blk.getFieldValue('Second');

        const json: BlocklyJSON = {};

        json.platform = 'time';
        json.at = `${number_hour}:${number_minute}:${number_second}`;

        return JSON.stringify(json);
    };

    block.binary_trigger = (blk: Block) => {
        const value_service = esidomGenerator.valueToCode(blk, 'Service', PRECEDENCE);
        const dropdown_state = blk.getFieldValue('State');

        const number_hour = blk.getFieldValue('Hour');
        const number_minute = blk.getFieldValue('Minute');
        const number_second = blk.getFieldValue('Second');

        const json: BlocklyJSON = {};

        json.platform = 'state';
        json.entity_id = value_service;

        if (dropdown_state === 'off') {
            json.from = 'on';
            json.to = 'off';
        } else if (dropdown_state === 'on') {
            json.from = 'off';
            json.to = 'on';
        }

        json.for = `${number_hour}:${number_minute}:${number_second}`;

        return JSON.stringify(json);
    };

    block.sun_trigger = (blk: Block) => {
        const number_hour = blk.getFieldValue('Hour');
        const number_minute = blk.getFieldValue('Minute');
        const number_second = blk.getFieldValue('Second');

        const dropdown_before_after = blk.getFieldValue('Before_after');

        const dropdown_sun = blk.getFieldValue('Sun');

        const json: BlocklyJSON = {};

        json.platform = 'sun';
        json.event = dropdown_sun;
        json.offset = `${dropdown_before_after}${number_hour}:${number_minute}:${number_second}`;

        return JSON.stringify(json);
    };

    block.numeric_state_trigger = (blk: Block) => {
        const dropdown_entities = blk.getFieldValue('Entities');
        const dropdown_attributes = blk.getFieldValue('Attributes');
        const dropdown_included = blk.getFieldValue('Included');

        const number_min = blk.getFieldValue('Minimum');
        const number_max = blk.getFieldValue('Maximum');

        const json: BlocklyJSON = {};

        if (dropdown_included === 'included') {
            json.platform = 'numeric_state';
            json.entity_id = dropdown_entities;
            json.above = number_min;
            json.below = number_max;
            if (dropdown_attributes !== 'noAttribute') {
                json.attribute = dropdown_attributes;
            }
        } else if (dropdown_included === 'notIncluded') {
            return `
                {
                    "platform": "numeric_state",
                    "entity_id": "${dropdown_entities}",
                    ${dropdown_attributes !== 'noAttribute' ? `"attribute": "${dropdown_attributes}",` : ''}
                    "below": ${number_min}
                },
                {
                    "platform": "numeric_state",
                    "entity_id": "${dropdown_entities}",
                    ${dropdown_attributes !== 'noAttribute' ? `"attribute": "${dropdown_attributes}",` : ''}
                    "above": ${number_max}
                }
            `;
        } else if (dropdown_included === 'greater') {
            json.platform = 'numeric_state';
            json.entity_id = dropdown_entities;
            json.above = number_min;
            if (dropdown_attributes !== 'noAttribute') {
                json.attribute = dropdown_attributes;
            }
        } else if (dropdown_included === 'lower') {
            json.platform = 'numeric_state';
            json.entity_id = dropdown_entities;
            json.below = number_max;
            if (dropdown_attributes !== 'noAttribute') {
                json.attribute = dropdown_attributes;
            }
        }

        return JSON.stringify(json);
    };

    block.interval_trigger = (blk: Block) => {
        const number_time = blk.getFieldValue('Time');
        const number_value = blk.getFieldValue('Time_value');

        const json: BlocklyJSON = {};

        json.platform = 'time_pattern';

        if (number_time === 'hour') {
            json.hours = `/${number_value}`;
        } else if (number_time === 'minute') {
            json.minutes = `/${number_value}`;
        } else if (number_time === 'second') {
            json.seconds = `/${number_value}`;
        }
        return JSON.stringify(json);
    };

    /**
     * Catégorie Condition
     */

    block.time_condition = (blk: Block) => {
        const number_hour_debut = blk.getFieldValue('Hour_start');
        const number_minute_debut = blk.getFieldValue('Minute_start');
        const number_second_debut = blk.getFieldValue('Second_start');
        const number_hour_end = blk.getFieldValue('Hour_end');
        const number_minute_end = blk.getFieldValue('Minute_end');
        const number_second_end = blk.getFieldValue('Second_end');

        const json: BlocklyJSON = {};

        const weekday = getWeekday(blk);

        json.condition = 'time';
        json.after = `${number_hour_debut}:${number_minute_debut}:${number_second_debut}`;
        json.before = `${number_hour_end}:${number_minute_end}:${number_second_end}`;
        json.weekday = weekday;

        return JSON.stringify(json);
    };

    block.time_condition_hour = (blk: Block) => {
        const number_hour_debut = blk.getFieldValue('Hour_start');
        const number_minute_debut = blk.getFieldValue('Minute_start');
        const number_second_debut = blk.getFieldValue('Second_start');
        const number_hour_end = blk.getFieldValue('Hour_end');
        const number_minute_end = blk.getFieldValue('Minute_end');
        const number_second_end = blk.getFieldValue('Second_end');

        const json: BlocklyJSON = {};
        json.condition = 'time';
        json.after = `${number_hour_debut}:${number_minute_debut}:${number_second_debut}`;
        json.before = `${number_hour_end}:${number_minute_end}:${number_second_end}`;

        return JSON.stringify(json);
    };

    block.time_condition_week = (blk: Block) => {
        const json: BlocklyJSON = {};

        const weekday = getWeekday(blk);

        json.condition = 'time';
        json.weekday = weekday;

        return JSON.stringify(json);
    };

    block.binary_condition = (blk: Block) => {
        const value_service = esidomGenerator.valueToCode(blk, 'Service', PRECEDENCE);
        const dropdown_state = blk.getFieldValue('State');
        const number_hour = blk.getFieldValue('Hour');
        const number_minute = blk.getFieldValue('Minute');
        const number_second = blk.getFieldValue('Second');

        const json: BlocklyJSON = {};

        json.condition = 'state';
        json.entity_id = value_service;
        json.state = dropdown_state;

        json.for = `${number_hour}:${number_minute}:${number_second}`;

        return JSON.stringify(json);
    };

    block.sun_condition = (blk: Block) => {
        const number_hour = blk.getFieldValue('Hour');
        const number_minute = blk.getFieldValue('Minute');
        const number_second = blk.getFieldValue('Second');

        const dropdown_before_after = blk.getFieldValue('Before_after');

        const dropdown_sun = blk.getFieldValue('Sun');

        const json: BlocklyJSON = {};

        if (dropdown_sun === 'sunrise') {
            json.condition = 'sun';
            json.after = dropdown_sun;
            json.before = 'sunset';
            json.after_offset = `${dropdown_before_after}${number_hour}:${number_minute}:${number_second}`;
        } else if (dropdown_sun === 'sunset') {
            json.condition = 'or';
            json.conditions = [
                {
                    condition: 'sun',
                    after: dropdown_sun,
                    after_offset: `${dropdown_before_after}${number_hour}:${number_minute}:${number_second}`,
                },
                {
                    condition: 'sun',
                    before: 'sunrise',
                },
            ];
        }
        return JSON.stringify(json);
    };

    block.numeric_state_condition = (blk: Block) => {
        const dropdown_entities = blk.getFieldValue('Entities');
        const dropdown_attributes = blk.getFieldValue('Attributes');
        const dropdown_included = blk.getFieldValue('Included');

        const number_min = blk.getFieldValue('Minimum');
        const number_max = blk.getFieldValue('Maximum');

        const json: BlocklyJSON = {};

        if (dropdown_included === 'included') {
            json.condition = 'numeric_state';
            json.entity_id = dropdown_entities;
            json.above = number_min;
            json.below = number_max;
            if (dropdown_attributes !== 'noAttribute') {
                json.attribute = dropdown_attributes;
            }
        } else if (dropdown_included === 'notIncluded') {
            json.condition = 'or';
            json.conditions = [
                {
                    condition: 'numeric_state',
                    entity_id: dropdown_entities,
                    below: number_min,
                    attribute: dropdown_attributes !== 'noAttribute' ? dropdown_attributes : '',
                },
                {
                    condition: 'numeric_state',
                    entity_id: dropdown_entities,
                    above: number_max,
                    attribute: dropdown_attributes !== 'noAttribute' ? dropdown_attributes : '',
                },
            ];
        } else if (dropdown_included === 'greater') {
            json.condition = 'numeric_state';
            json.entity_id = dropdown_entities;
            json.above = number_min;
            if (dropdown_attributes !== 'noAttribute') {
                json.attribute = dropdown_attributes;
            }
        } else if (dropdown_included === 'lower') {
            json.condition = 'numeric_state';
            json.entity_id = dropdown_entities;
            json.below = number_max;
            if (dropdown_attributes !== 'noAttribute') {
                json.attribute = dropdown_attributes;
            }
        }

        return JSON.stringify(json);
    };

    /**
     * Catégorie Action
     */

    block.object_action = (blk: Block) => {
        const dropdown_entities = blk.getFieldValue('Entities');
        const dropdown_services = blk.getFieldValue('Services');
        const value_color = esidomGenerator.valueToCode(blk, 'Color', PRECEDENCE);
        const value_brightness = esidomGenerator.valueToCode(blk, 'Brightness', PRECEDENCE);
        const value_temp = esidomGenerator.valueToCode(blk, 'Temperature', PRECEDENCE);

        const json: BlocklyJSON = {};
        const data: BlocklyData = {};

        json.entity_id = dropdown_entities;
        json.service = dropdown_services;

        if (value_color !== '') {
            data.rgb_color = hexToRgb(value_color);
        }

        if (value_brightness !== '') {
            data.brightness = value_brightness;
        }

        if (value_temp !== '') {
            data.color_temp = value_temp;
        }

        json.data = data;

        return JSON.stringify(json);
    };

    block.delay_action = (blk: Block) => {
        const number_hour = blk.getFieldValue('Hour');
        const number_minute = blk.getFieldValue('Minute');
        const number_second = blk.getFieldValue('Second');

        const json: BlocklyJSON = {};

        const delay = `${number_hour}:${number_minute}:${number_second}`;

        json.delay = delay;

        return JSON.stringify(json);
    };

    /**
     * Catégorie Contrôle de lampe
     */

    block.color_picker = (blk: Block) => {
        const color_value = blk.getFieldValue('Color');

        return [color_value, PRECEDENCE];
    };

    block.color_rgb = (blk: Block) => {
        const number_red = blk.getFieldValue('Red');
        const number_green = blk.getFieldValue('Green');
        const number_blue = blk.getFieldValue('Blue');

        const hex = rgbToHex(number_red, number_green, number_blue);

        return [hex, PRECEDENCE];
    };

    block.brightness = (blk: Block) => {
        const brightness_value = blk.getFieldValue('Brightness');

        return [brightness_value, PRECEDENCE];
    };

    block.color_temp = (blk: Block) => {
        const temperature_value = blk.getFieldValue('Temperature');

        return [temperature_value, PRECEDENCE];
    };

    // Scrub for combining two same blks
    // eslint-disable-next-line no-underscore-dangle
    block.scrub_ = (blk, code, opt_thisOnly) => {
        const nextBlock = blk.nextConnection && blk.nextConnection.targetBlock();
        const nextCode = opt_thisOnly ? '' : esidomGenerator.blockToCode(nextBlock);

        if (nextCode === '') {
            return code;
        }

        return `${code},\n${nextCode}`;
    };
})(esidomGenerator as unknown as BlocksGenerator);

export default esidomGenerator;
