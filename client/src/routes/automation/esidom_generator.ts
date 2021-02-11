/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import Blockly from 'blockly';
import type { Block } from 'blockly';

const esidomGenerator = new Blockly.Generator('ESIDOM');

const PRECEDENCE = 0;

interface BlocklyJSON {
    trigger?: string;
    condition?: string;
    action?: string;
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
}

interface BlocksGenerator {
    automation: (blk: Block) => void;
    binary_trigger: (blk: Block) => void;
    time: (blk: Block) => void;
    time_condition: (blk: Block) => void;
    sun_condition: (blk: Block) => void;
    time_condition_hour: (blk: Block) => void;
    time_condition_week: (blk: Block) => void;
    binary_condition: (blk: Block) => void;
    action: (blk: Block) => void;
    color_picker: (blk: Block) => void;
    color_rgb: (blk: Block) => void;
    scrub: (blk: Block, code: string, opt_thisOnly: string) => void
    jsonInit:(a: Block)=> void;
}

((block: BlocksGenerator) => {
    block.automation = (blk: Block) => {
        const statements_trigger = esidomGenerator.statementToCode(blk, 'Trigger');
        const statements_condition = esidomGenerator.statementToCode(blk, 'Condition');
        const statements_action = esidomGenerator.statementToCode(blk, 'Action');
        const dropdown_mode = blk.getFieldValue('Mode');

        const json: BlocklyJSON = {};

        console.log(statements_trigger);
        console.log(statements_condition);
        console.log(statements_action);
        console.log(dropdown_mode);

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

        return JSON.stringify(json);
    };

    block.time = (blk: Block) => {
        const number_hour = blk.getFieldValue('Hour');
        const number_minute = blk.getFieldValue('Minute');
        const number_second = blk.getFieldValue('Second');

        const json: BlocklyJSON = {};

        json.platform = 'time';
        json.at = `${number_hour}:${number_minute}:${number_second}`;

        return JSON.stringify(json);
    };

    block.action = (blk: Block) => {
        const value_service = esidomGenerator.valueToCode(blk, 'Service', PRECEDENCE);
        const value_entity = esidomGenerator.valueToCode(blk, 'Entity', PRECEDENCE);

        const json: BlocklyJSON = {};

        json.service = value_service;
        json.entity_id = value_entity;

        return JSON.stringify(json);
    };

    block.time_condition = (blk: Block) => {
        const number_hour_debut = blk.getFieldValue('Hour_debut');
        const number_minute_debut = blk.getFieldValue('Minute_debut');
        const number_second_debut = blk.getFieldValue('Second_debut');
        const number_hour_end = blk.getFieldValue('Hour_end');
        const number_minute_end = blk.getFieldValue('Minute_end');
        const number_second_end = blk.getFieldValue('Second_end');
        const checkbox_mon = blk.getFieldValue('mon') === 'TRUE';
        const checkbox_tue = blk.getFieldValue('tue') === 'TRUE';
        const checkbox_wed = blk.getFieldValue('wed') === 'TRUE';
        const checkbox_thu = blk.getFieldValue('thu') === 'TRUE';
        const checkbox_fri = blk.getFieldValue('fri') === 'TRUE';
        const checkbox_sat = blk.getFieldValue('sat') === 'TRUE';
        const checkbox_sun = blk.getFieldValue('sun') === 'TRUE';

        const json: BlocklyJSON = {};

        const weekday = [];
        if (checkbox_mon) { weekday.push('mon'); }
        if (checkbox_tue) { weekday.push('tue'); }
        if (checkbox_wed) { weekday.push('wed'); }
        if (checkbox_thu) { weekday.push('thu'); }
        if (checkbox_fri) { weekday.push('fri'); }
        if (checkbox_sat) { weekday.push('sat'); }
        if (checkbox_sun) { weekday.push('sun'); }

        json.condition = 'time';
        json.after = `${number_hour_debut}:${number_minute_debut}:${number_second_debut}`;
        json.before = `${number_hour_end}:${number_minute_end}:${number_second_end}`;
        json.weekday = weekday;

        return JSON.stringify(json);
    };

    block.binary_trigger = (blk: Block) => {
        const value_service = esidomGenerator.valueToCode(blk, 'Service', PRECEDENCE);
        const dropdown_state = blk.getFieldValue('state');

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

    block.sun_condition = (blk: Block) => {
        const dropdown_sun_sun = blk.getFieldValue('sun.sun');

        const json: BlocklyJSON = {};
        json.condition = 'state';
        json.entity_id = 'sun.sun';
        json.state = dropdown_sun_sun;

        return JSON.stringify(json);
    };

    block.binary_condition = (blk: Block) => {
        const value_service = esidomGenerator.valueToCode(blk, 'Service', PRECEDENCE);
        const dropdown_state = blk.getFieldValue('state');

        const json: BlocklyJSON = {};

        json.condition = 'state';
        json.entity_id = value_service;
        json.state = dropdown_state;

        return JSON.stringify(json);
    };

    block.color_picker = (blk: Block) => {
        const color_value = blk.getFieldValue('color');

        console.log(color_value);

        const json: BlocklyJSON = {};

        json.rgb_color = color_value;

        return JSON.stringify(json);
    };

    block.color_rgb = (blk: Block) => {
        const number_red = blk.getFieldValue('red');
        const number_green = blk.getFieldValue('green');
        const number_blue = blk.getFieldValue('blue');
        const color_value = `#${number_red.toString(16).padStart(2, '0')}${number_green.toString(16).padStart(2, '0')}${number_blue.toString(16).padStart(2, '0')}`;
        const json: BlocklyJSON = {};

        json.rgb_color = color_value;

        return JSON.stringify(json);
    };

    block.time_condition_hour = (blk: Block) => {
        const number_hour_debut = blk.getFieldValue('Hour_debut');
        const number_minute_debut = blk.getFieldValue('Minute_debut');
        const number_second_debut = blk.getFieldValue('Second_debut');
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
        const checkbox_mon = blk.getFieldValue('mon') === 'TRUE';
        const checkbox_tue = blk.getFieldValue('tue') === 'TRUE';
        const checkbox_wed = blk.getFieldValue('wed') === 'TRUE';
        const checkbox_thu = blk.getFieldValue('thu') === 'TRUE';
        const checkbox_fri = blk.getFieldValue('fri') === 'TRUE';
        const checkbox_sat = blk.getFieldValue('sat') === 'TRUE';
        const checkbox_sun = blk.getFieldValue('sun') === 'TRUE';
        const json: BlocklyJSON = {};

        const weekday = [];
        if (checkbox_mon) { weekday.push('mon'); }
        if (checkbox_tue) { weekday.push('tue'); }
        if (checkbox_wed) { weekday.push('wed'); }
        if (checkbox_thu) { weekday.push('thu'); }
        if (checkbox_fri) { weekday.push('fri'); }
        if (checkbox_sat) { weekday.push('sat'); }
        if (checkbox_sun) { weekday.push('sun'); }

        json.condition = 'time';
        json.weekday = weekday;

        return JSON.stringify(json);
    };

    // Scrub for combining two same blks
    block.scrub = (blk, code, opt_thisOnly) => {
        const nextBlock = blk.nextConnection && blk.nextConnection.targetBlock();
        const nextCode = opt_thisOnly ? '' : esidomGenerator.blockToCode(nextBlock);

        if (nextCode === '') {
            return code;
        }

        return `${code},\n${nextCode}`;
    };
})(esidomGenerator as unknown as BlocksGenerator);

export default esidomGenerator;
