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
                const hourStart = start?.[0];
                const minutesStart = start?.[1];
                const secondStart = start?.[2];

                const end = blocklyJSON.before?.split(':');
                const hourEnd = end?.[0];
                const minutesEnd = end?.[1];
                const secondEnd = end?.[2];

                xml += `
                    <block type="time_condition_hour">
                        <field name="Hour_start">${hourStart}</field>
                        <field name="Minute_start">${minutesStart}</field>
                        <field name="Second_start">${secondStart}</field>
                        <field name="Hour_end">${hourEnd}</field>
                        <field name="Minute_end">${minutesEnd}</field>
                        <field name="Second_end">${secondEnd}</field>
                    </block>
                `;
            } else if (keys.includes('weekday') && keys.includes('after') && keys.includes('before')) {
                const start = blocklyJSON.after?.split(':');
                const hourStart = start?.[0];
                const minutesStart = start?.[1];
                const secondStart = start?.[2];

                const end = blocklyJSON.before?.split(':');
                const hourEnd = end?.[0];
                const minutesEnd = end?.[1];
                const secondEnd = end?.[2];

                const { weekday } = blocklyJSON;

                xml += `
                    <block type="time_condition">
                        <field name="Hour_start">${hourStart}</field>
                        <field name="Minute_start">${minutesStart}</field>
                        <field name="Second_start">${secondStart}</field>
                        <field name="Hour_end">${hourEnd}</field>
                        <field name="Minute_end">${minutesEnd}</field>
                        <field name="Second_end">${secondEnd}</field>
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
    },
};

export default esidomBlockGenerator;
