import { Block } from 'blockly';
import type { BlocklyJSON } from './esidomGenerator';

interface BlockGenerator {
    [key: string] : (tab: BlocklyJSON)=> string;
}

interface EsidomBlockGenerator{
    [key: string] : BlockGenerator;
}

function getWeekFields(weekday: string[]): string {
    const xml = `
        <field name="Mon">${weekday.includes('mon') ? 'TRUE' : 'FALSE'}</field>
        <field name="Tue">${weekday.includes('tue') ? 'TRUE' : 'FALSE'}</field>
        <field name="Wed">${weekday.includes('wed') ? 'TRUE' : 'FALSE'}</field>
        <field name="Thu">${weekday.includes('thu') ? 'TRUE' : 'FALSE'}</field>
        <field name="Fri">${weekday.includes('fri') ? 'TRUE' : 'FALSE'}</field>
        <field name="Sat">${weekday.includes('sat') ? 'TRUE' : 'FALSE'}</field>
        <field name="Sun">${weekday.includes('sun') ? 'TRUE' : 'FALSE'}</field>
    `;
    return xml;
}

const esidomBlockGenerator: EsidomBlockGenerator = {
    platform: {
        time(blocklyJSON: BlocklyJSON): string {
            const time = blocklyJSON.at?.split(':');
            const hours = time?.[0];
            const minutes = time?.[1];
            const second = time?.[2];
            const xml = `
            <block type="time_trigger">
            <field name="Hour">${hours}</field>
            <field name="Minute">${minutes}</field>
            <field name="Second">${second}</field>
            </block>
            `;
            return xml;
        },
        state(blocklyJSON: BlocklyJSON): string {
            const service = blocklyJSON.entity_id;
            const state = blocklyJSON.to;
            const xml = `
            <block type="binary_trigger">
                <value name="Service">    
                <block type="binary_sensor">
                    <field name="Object">${service}</field>
                </block>
                </value>
            <field name="State">${state}</field>
            </block>
            `;
            return xml;
        },
        sun(blocklyJSON: BlocklyJSON): string {
            const offSet = blocklyJSON.offset?.split(':');
            const offSetHour = offSet?.[0];
            const hours = offSetHour?.substring(1);

            const minutes = offSet?.[1];
            const seconds = offSet?.[2];

            const beforeAfter = offSetHour?.substring(0, 1);
            const sun = blocklyJSON.event;

            return `
                <block type="sun_trigger">
                <field name="Hour">${hours}</field>
                <field name="Minute">${minutes}</field>
                <field name="Second">${seconds}</field>
                <field name="Before_after">${beforeAfter}</field>
                <field name="Sun">${sun}</field>
                </block>
            `;
        },
    },
    condition: {
        time(blocklyJSON: BlocklyJSON): string {
            let xml = '';
            const keys = Object.keys(blocklyJSON);

            if (keys.includes('weekday') && !keys.includes('after') && !keys.includes('before')) {
                const { weekday } = blocklyJSON;

                xml += `
                    <block type="time_condition_week">';
                        ${weekday ? getWeekFields(weekday) : ''}
                    </block>
                `;
                return xml;
            } if (!keys.includes('weekday') && keys.includes('after') && keys.includes('before')) {
                const start = blocklyJSON.after?.split(':');
                const hoursStart = start?.[0];
                const minutesStart = start?.[1];
                const secondsStart = start?.[2];

                const end = blocklyJSON.before?.split(':');
                const hoursEnd = end?.[0];
                const minutesEnd = end?.[1];
                const secondsEnd = end?.[2];

                xml += `
                    <block type="time_condition_hour">
                        <field name="Hour_start">${hoursStart}</field>
                        <field name="Minute_start">${minutesStart}</field>
                        <field name="Second_start">${secondsStart}</field>
                        <field name="Hour_end">${hoursEnd}</field>
                        <field name="Minute_end">${minutesEnd}</field>
                        <field name="Second_end">${secondsEnd}</field>
                    </block>
                `;
            } else if (keys.includes('weekday') && keys.includes('after') && keys.includes('before')) {
                const start = blocklyJSON.after?.split(':');
                const hoursStart = start?.[0];
                const minutesStart = start?.[1];
                const secondsStart = start?.[2];

                const end = blocklyJSON.before?.split(':');
                const hoursEnd = end?.[0];
                const minutesEnd = end?.[1];
                const secondsEnd = end?.[2];

                const { weekday } = blocklyJSON;

                xml += `
                    <block type="time_condition">
                        <field name="Hour_start">${hoursStart}</field>
                        <field name="Minute_start">${minutesStart}</field>
                        <field name="Second_start">${secondsStart}</field>
                        <field name="Hour_end">${hoursEnd}</field>
                        <field name="Minute_end">${minutesEnd}</field>
                        <field name="Second_end">${secondsEnd}</field>
                        ${weekday ? getWeekFields(weekday) : ''}
                    </block>
                `;
            }

            return xml;
        },
        state(blocklyJSON: BlocklyJSON): string {
            const service = blocklyJSON.entity_id;
            const { state } = blocklyJSON;

            return `
                <block type="binary_condition">
                    <value name="Service">    
                    <block type="binary_sensor">
                        <field name="Object">${service}</field>
                    </block>
                    </value>
                <field name="State">${state}</field>
                </block>
            `;
        },
        sun(blocklyJSON: BlocklyJSON): string {
            const offSet = blocklyJSON.after_offset?.split(':');
            const offSetHour = offSet?.[0];
            const hours = offSetHour?.substring(1);

            const minutes = offSet?.[1];
            const seconds = offSet?.[2];

            const beforeAfter = offSetHour?.substring(0, 1);
            const sun = blocklyJSON.after;

            return `
                <block type="sun_condition">
                <field name="Hour">${hours}</field>
                <field name="Minute">${minutes}</field>
                <field name="Second">${seconds}</field>
                <field name="Before_after">${beforeAfter}</field>
                <field name="Sun">${sun}</field>
                </block>
            `;
        },
        or(blocklyJSON: BlocklyJSON): string {
            const condition = blocklyJSON.conditions?.[0];

            if (condition?.condition === 'sun') {
                const offSet = condition.after_offset?.split(':');
                const offSetHour = offSet?.[0];
                const hours = offSetHour?.substring(1);

                const minutes = offSet?.[1];
                const seconds = offSet?.[2];

                const beforeAfter = offSetHour?.substring(0, 1);
                const sun = condition.after;

                return `
                    <block type="sun_condition">
                    <field name="Hour">${hours}</field>
                    <field name="Minute">${minutes}</field>
                    <field name="Second">${seconds}</field>
                    <field name="Before_after">${beforeAfter}</field>
                    <field name="Sun">${sun}</field>
                    </block>
                `;
            }
            if (condition?.condition === 'numeric_state') {
                const entity = condition.entity_id;
                const { attribute } = condition;
                const { below } = condition;
                const above = blocklyJSON.conditions?.[1].above;

                return `
                    <block type="numeric_state_condition">
                    <field name="Entities">${entity}</field>
                    <field name="Attributes">${attribute ?? 'noAttribute'}</field>
                    <field name="Included">notIncluded</field>
                    <field name="Minimum">${below}</field>
                    <field name="Maximum">${above}</field>
                    </block>
                `;
            }
            return '';
        },
        numeric_state(blocklyJSON: BlocklyJSON): string {
            const entity = blocklyJSON.entity_id;
            const { attribute } = blocklyJSON;
            const { above } = blocklyJSON;
            const { below } = blocklyJSON;

            if (above !== undefined && below !== undefined) {
                return `
                    <block type="numeric_state_condition">
                    <field name="Entities">${entity}</field>
                    <field name="Attributes">${attribute ?? 'noAttribute'}</field>
                    <field name="Included">included</field>
                    <field name="Minimum">${above}</field>
                    <field name="Maximum">${below}</field>
                    </block>
                `;
            }
            if (above !== undefined && below === undefined) {
                return `
                    <block type="numeric_state_condition">
                    <field name="Entities">${entity}</field>
                    <field name="Attributes">${attribute ?? 'noAttribute'}</field>
                    <field name="Included">greater</field>
                    <field name="Maximum">${above}</field>
                    </block>
                `;
            }
            if (above === undefined && below !== undefined) {
                return `
                    <block type="numeric_state_condition">
                    <field name="Entities">${entity}</field>
                    <field name="Attributes">${attribute ?? 'noAttribute'}</field>
                    <field name="Included">lower</field>
                    <field name="Minimum">${below}</field>
                    </block>
                `;
            }

            return '';
        },
    },
};

export default esidomBlockGenerator;
