import Blockly from 'blockly';
import type { ObjectBlock } from '../../../types/objectsBlockType';

export default class BlocklyObjects {
    private name: string;

    private type: string;

    private prefix: string;

    private colour: number;

    private options: string[][] = [];

    private toolTip: string;

    constructor(name: string, type: string, prefix: string, colour: number, toolTip: string) {
        this.name = name;
        this.type = type;
        this.prefix = prefix;
        this.colour = colour < 0 || colour > 360 ? 0 : colour;
        this.toolTip = toolTip;
    }

    addOption(optionName: string, option: string): void {
        const optionNameWithPrefix = this.prefix + optionName;
        this.options.push([optionNameWithPrefix, option]);
    }

    addOptions(options: string[][]): void {
        this.options = options;
    }

    getJson(): ObjectBlock {
        return {
            type: this.name,
            message0: `${this.prefix}%1`,
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'Object',
                    options: this.options,
                },
            ],
            output: this.type,
            colour: this.colour.toString(),
            tooltip: this.toolTip,
            helpUrl: '',
        };
    }
}
