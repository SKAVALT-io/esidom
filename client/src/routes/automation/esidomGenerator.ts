/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import Blockly from 'blockly';
import type { Block } from 'blockly';

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
    rgb_color?: string;
    alias?: string;
    after_offset?: string;
    offset?: string;
    event?: string
    conditions?: BlocklyJSON[];
}

export type EntityTypeEnum = 'binary_sensor' | 'person' | 'weather' | 'zwave' | 'sensor' | 'light' | 'automation' | 'switch' | 'media_player';
const types: EntityTypeEnum[] = ['binary_sensor', 'person', 'weather', 'zwave', 'sensor', 'light', 'automation', 'switch', 'media_player'];

export type BlocksGenerator = {
    [key in EntityTypeEnum]: (a: Block, code: string, opt_thisOnly: string) => void;
} & {
    esidom_automation: (blk: Block) => void;
    binary_trigger: (blk: Block) => void;
    time_trigger: (blk: Block) => void;
    sun_trigger: (blk: Block) => void;
    time_condition: (blk: Block) => void;
    sun_condition: (blk: Block) => void;
    time_condition_hour: (blk: Block) => void;
    time_condition_week: (blk: Block) => void;
    binary_condition: (blk: Block) => void;
    action: (blk: Block) => void;
    color_picker: (blk: Block) => void;
    color_rgb: (blk: Block) => void;
    object_action: (blk: Block) => void;
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

        const json: BlocklyJSON = {};

        json.condition = 'state';
        json.entity_id = value_service;
        json.state = dropdown_state;

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

    /**
     * Catégorie Action
     */

    block.object_action = (blk: Block) => {
        const dropdown_entities = blk.getFieldValue('Entities');
        const dropdown_services = blk.getFieldValue('Services');

        const json: BlocklyJSON = {};

        const entity_id = dropdown_entities.split(':')[1];

        json.alias = dropdown_entities;
        json.entity_id = entity_id;
        json.service = dropdown_services ?? '';
        return JSON.stringify(json);
    };

    /**
     * Catégorie Couleur
     */

    block.color_picker = (blk: Block) => {
        const color_value = blk.getFieldValue('Color');

        const json: BlocklyJSON = {};

        json.rgb_color = color_value;

        return JSON.stringify(json);
    };

    block.color_rgb = (blk: Block) => {
        const number_red = blk.getFieldValue('Red');
        const number_green = blk.getFieldValue('Green');
        const number_blue = blk.getFieldValue('Blue');
        const color_value = `#${number_red.toString(16).padStart(2, '0')}${number_green.toString(16).padStart(2, '0')}${number_blue.toString(16).padStart(2, '0')}`;
        const json: BlocklyJSON = {};

        json.rgb_color = color_value;

        return JSON.stringify(json);
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
