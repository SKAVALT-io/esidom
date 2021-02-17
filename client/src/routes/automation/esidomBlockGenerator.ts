import type { BlocklyJSON } from './esidomGenerator';

interface BlockGenerator {
    [key: string] : (tab: BlocklyJSON)=> string;
}

interface EsidomBlockGenerator{
    [key: string] : BlockGenerator;
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
    },
    condition: {
        time(blocklyJSON: BlocklyJSON): string {
            let xml = '';
            const { length } = Object.keys(blocklyJSON);
            if (length === 2) {
                // TODO
            } else if (length === 3) {
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
            } else if (length === 4) {
                // TODO
            }

            return xml;
        },
    },
};

export default esidomBlockGenerator;
