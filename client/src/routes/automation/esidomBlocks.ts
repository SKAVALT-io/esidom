/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
import Blockly from 'blockly';
import COLORS from './esidomConst';
import type { EntityTypeEnum } from './esidomGenerator';
import { tr } from '../../utils/i18nHelper';

type BlockFunctions = {
    init: ()=> void;
    jsonInit?:(a: any)=> void;
    appendDummyInput?: (str?: string)=> BlockFunctions;
    appendField?: (...args: Array<string | Blockly.FieldDropdown>)=> BlockFunctions;
    setInputsInline?: (b: boolean) => BlockFunctions;
    setPreviousStatement?: (b: boolean, str: string)=> BlockFunctions;
    setNextStatement?: (b: boolean, str: string) => BlockFunctions;
    setColour?: (str: string) => BlockFunctions;
    setTooltip?: (str: string) => BlockFunctions;
    setHelpUrl?: (str: string) => BlockFunctions;
    removeInput?: (str: string) => BlockFunctions;
    setmutator?: (str: string) => BlockFunctions;
};

export type BlocksDefinitions = {
    [key in EntityTypeEnum]: BlockFunctions;
} & {
    esidom_automation: BlockFunctions;
    binary_trigger: BlockFunctions;
    time_trigger: BlockFunctions;
    sun_trigger: BlockFunctions;
    numeric_state_trigger: BlockFunctions;
    time_condition: BlockFunctions;
    sun_condition: BlockFunctions;
    time_condition_hour: BlockFunctions;
    time_condition_week: BlockFunctions;
    binary_condition: BlockFunctions;
    numeric_state_condition: BlockFunctions;
    action: BlockFunctions;
    color_picker: BlockFunctions;
    color_rgb: BlockFunctions;
    brightness: BlockFunctions;
    color_temp: BlockFunctions;
    color_brightness_temp: BlockFunctions;
    object_action: BlockFunctions;
    delay_action: BlockFunctions;
}

/**
 * Bloc ESIDOM
 */
((block: BlocksDefinitions) => {
    block.esidom_automation = {
        init() {
            this.jsonInit?.(
                {
                    type: 'esidom_automation',
                    message0: tr('blockly.blocks.esidom_automation.message'),
                    args0: [
                        {
                            type: 'input_statement',
                            name: 'Trigger',
                            check: 'Trigger',
                        },
                        {
                            type: 'input_statement',
                            name: 'Condition',
                            check: 'Condition',
                        },
                        {
                            type: 'input_statement',
                            name: 'Action',
                            check: 'Action',
                        },
                    ],
                    colour: COLORS.HUE_DARK_BLUE,
                    tooltip: tr('blockly.blocks.esidom_automation.tooltip'),
                    helpUrl: '',
                },
            );
        },
    };

    /**
     * Catégorie Déclencheur
     */
    block.binary_trigger = {
        init() {
            this.jsonInit?.(
                {
                    type: 'binary_trigger',
                    message0: tr('blockly.blocks.binary_trigger.message'),
                    args0: [
                        {
                            type: 'input_value',
                            name: 'Service',
                            check: 'Binary_sensor',
                        },
                        {
                            type: 'field_dropdown',
                            name: 'State',
                            options: [
                                [
                                    'ON',
                                    'on',
                                ],
                                [
                                    'OFF',
                                    'off',
                                ],
                            ],
                        },
                    ],
                    inputsInline: true,
                    previousStatement: 'Trigger',
                    nextStatement: 'Trigger',
                    colour: COLORS.HUE_GREEN,
                    tooltip: tr('blockly.blocks.binary_trigger.tooltip'),
                    helpUrl: '',
                },
            );
        },
    };

    block.time_trigger = {
        init() {
            this.jsonInit?.(
                {
                    type: 'time_trigger',
                    message0: tr('blockly.blocks.time_trigger.message'),
                    args0: [
                        {
                            type: 'field_number',
                            name: 'Hour',
                            value: 0,
                            min: 0,
                            max: 23,
                        },
                        {
                            type: 'input_dummy',
                        },
                        {
                            type: 'field_number',
                            name: 'Minute',
                            value: 0,
                            min: 0,
                            max: 59,
                        },
                        {
                            type: 'input_dummy',
                        },
                        {
                            type: 'field_number',
                            name: 'Second',
                            value: 0,
                            min: 0,
                            max: 59,
                        },
                    ],
                    inputsInline: true,
                    previousStatement: 'Trigger',
                    nextStatement: 'Trigger',
                    colour: COLORS.HUE_GREEN,
                    tooltip: tr('blockly.blocks.time_trigger.tooltip'),
                    helpUrl: '',
                },
            );
        },
    };

    block.sun_trigger = {
        init() {
            this.jsonInit?.(
                {
                    type: 'sun_trigger',
                    message0: tr('blockly.blocks.sun_trigger.message'),
                    args0: [
                        {
                            type: 'field_number',
                            name: 'Hour',
                            value: 0,
                            min: 0,
                            max: 23,
                        },
                        {
                            type: 'field_number',
                            name: 'Minute',
                            value: 0,
                            min: 0,
                            max: 59,
                        },
                        {
                            type: 'field_number',
                            name: 'Second',
                            value: 0,
                            min: 0,
                            max: 59,
                        },
                        {
                            type: 'field_dropdown',
                            name: 'Before_after',
                            options: [
                                [
                                    tr('blockly.blocks.sun_trigger.before_after.before'),
                                    '-',
                                ],
                                [
                                    tr('blockly.blocks.sun_trigger.before_after.after'),
                                    '+',
                                ],
                            ],
                        },
                        {
                            type: 'field_dropdown',
                            name: 'Sun',
                            options: [
                                [
                                    tr('blockly.blocks.sun_trigger.sun.sunrise'),
                                    'sunrise',
                                ],
                                [
                                    tr('blockly.blocks.sun_trigger.sun.sunset'),
                                    'sunset',
                                ],
                            ],
                        },
                    ],
                    previousStatement: 'Trigger',
                    nextStatement: 'Trigger',
                    colour: COLORS.HUE_GREEN,
                    tooltip: tr('blockly.blocks.sun_trigger.tooltip'),
                    helpUrl: '',
                },
            );
        },
    };

    /**
     * Catégorie Condition
     */
    block.time_condition = {
        init() {
            this.jsonInit?.(
                {
                    type: 'time_condition',
                    message0: tr('blockly.blocks.time_condition.message'),
                    args0: [
                        {
                            type: 'field_number',
                            name: 'Hour_start',
                            value: 0,
                            min: 0,
                            max: 23,
                        },
                        {
                            type: 'field_number',
                            name: 'Minute_start',
                            value: 0,
                            min: 0,
                            max: 59,
                        },
                        {
                            type: 'field_number',
                            name: 'Second_start',
                            value: 0,
                            min: 0,
                            max: 59,
                        },
                        {
                            type: 'input_dummy',
                            align: 'RIGHT',
                        },
                        {
                            type: 'field_number',
                            name: 'Hour_end',
                            value: 0,
                            min: 0,
                            max: 23,
                        },
                        {
                            type: 'field_number',
                            name: 'Minute_end',
                            value: 0,
                            min: 0,
                            max: 59,
                        },
                        {
                            type: 'field_number',
                            name: 'Second_end',
                            value: 0,
                            min: 0,
                            max: 59,
                        },
                        {
                            type: 'input_dummy',
                            align: 'RIGHT',
                        },
                        {
                            type: 'field_checkbox',
                            name: 'Mon',
                            checked: true,
                        },
                        {
                            type: 'input_dummy',
                        },
                        {
                            type: 'field_checkbox',
                            name: 'Tue',
                            checked: true,
                        },
                        {
                            type: 'input_dummy',
                        },
                        {
                            type: 'field_checkbox',
                            name: 'Wed',
                            checked: true,
                        },
                        {
                            type: 'input_dummy',
                        },
                        {
                            type: 'field_checkbox',
                            name: 'Thu',
                            checked: true,
                        },
                        {
                            type: 'input_dummy',
                        },
                        {
                            type: 'field_checkbox',
                            name: 'Fri',
                            checked: true,
                        },
                        {
                            type: 'input_dummy',
                        },
                        {
                            type: 'field_checkbox',
                            name: 'Sat',
                            checked: true,
                        },
                        {
                            type: 'input_dummy',
                        },
                        {
                            type: 'field_checkbox',
                            name: 'Sun',
                            checked: true,
                        },
                    ],
                    inputsInline: false,
                    previousStatement: 'Condition',
                    nextStatement: 'Condition',
                    colour: COLORS.HUE_YELLOW,
                    tooltip: tr('blockly.blocks.time_condition.tooltip'),
                    helpUrl: '',
                },
            );
        },
    };

    block.sun_condition = {
        init() {
            this.jsonInit?.(
                {
                    type: 'sun_condition',
                    message0: tr('blockly.blocks.sun_condition.message'),
                    args0: [
                        {
                            type: 'field_number',
                            name: 'Hour',
                            value: 0,
                            min: 0,
                            max: 23,
                        },
                        {
                            type: 'field_number',
                            name: 'Minute',
                            value: 0,
                            min: 0,
                            max: 59,
                        },
                        {
                            type: 'field_number',
                            name: 'Second',
                            value: 0,
                            min: 0,
                            max: 59,
                        },
                        {
                            type: 'field_dropdown',
                            name: 'Before_after',
                            options: [
                                [
                                    tr('blockly.blocks.sun_condition.before_after.before'),
                                    '-',
                                ],
                                [
                                    tr('blockly.blocks.sun_condition.before_after.after'),
                                    '+',
                                ],
                            ],
                        },
                        {
                            type: 'field_dropdown',
                            name: 'Sun',
                            options: [
                                [
                                    tr('blockly.blocks.sun_condition.sun.sunrise'),
                                    'sunrise',
                                ],
                                [
                                    tr('blockly.blocks.sun_condition.sun.sunset'),
                                    'sunset',
                                ],
                            ],
                        },
                    ],
                    previousStatement: 'Condition',
                    nextStatement: 'Condition',
                    colour: COLORS.HUE_YELLOW,
                    tooltip: tr('blockly.blocks.sun_condition.tooltip'),
                    helpUrl: '',
                },
            );
        },
    };

    block.time_condition_hour = {
        init() {
            this.jsonInit?.({
                type: 'time_condition_hour',
                lastDummyAlign0: 'RIGHT',
                message0: tr('blockly.blocks.time_condition_hour.message'),
                args0: [
                    {
                        type: 'field_number',
                        name: 'Hour_start',
                        value: 0,
                        min: 0,
                        max: 23,
                    },
                    {
                        type: 'field_number',
                        name: 'Minute_start',
                        value: 0,
                        min: 0,
                        max: 59,
                    },
                    {
                        type: 'field_number',
                        name: 'Second_start',
                        value: 0,
                        min: 0,
                        max: 59,
                    },
                    {
                        type: 'input_dummy',
                    },
                    {
                        type: 'field_number',
                        name: 'Hour_end',
                        value: 0,
                        min: 0,
                        max: 23,
                    },
                    {
                        type: 'field_number',
                        name: 'Minute_end',
                        value: 0,
                        min: 0,
                        max: 59,
                    },
                    {
                        type: 'field_number',
                        name: 'Second_end',
                        value: 0,
                        min: 0,
                        max: 59,
                    },
                ],
                inputsInline: false,
                previousStatement: 'Condition',
                nextStatement: 'Condition',
                colour: COLORS.HUE_YELLOW,
                tooltip: tr('blockly.blocks.time_condition_hour.tooltip'),
                helpUrl: '',
            });
        },
    };

    block.time_condition_week = {
        init() {
            this.jsonInit?.(
                {
                    type: 'time_condition_week',
                    message0: tr('blockly.blocks.time_condition_week.message'),
                    args0: [
                        {
                            type: 'field_checkbox',
                            name: 'Mon',
                            checked: true,
                        },
                        {
                            type: 'input_dummy',
                        },
                        {
                            type: 'field_checkbox',
                            name: 'Tue',
                            checked: true,
                        },
                        {
                            type: 'input_dummy',
                        },
                        {
                            type: 'field_checkbox',
                            name: 'Wed',
                            checked: true,
                        },
                        {
                            type: 'input_dummy',
                        },
                        {
                            type: 'field_checkbox',
                            name: 'Thu',
                            checked: true,
                        },
                        {
                            type: 'input_dummy',
                        },
                        {
                            type: 'field_checkbox',
                            name: 'Fri',
                            checked: true,
                        },
                        {
                            type: 'input_dummy',
                        },
                        {
                            type: 'field_checkbox',
                            name: 'Sat',
                            checked: true,
                        },
                        {
                            type: 'input_dummy',
                        },
                        {
                            type: 'field_checkbox',
                            name: 'Sun',
                            checked: true,
                        },
                    ],
                    inputsInline: false,
                    previousStatement: 'Condition',
                    nextStatement: 'Condition',
                    colour: COLORS.HUE_YELLOW,
                    tooltip: tr('blockly.blocks.time_condition_week.tooltip'),
                    helpUrl: '',
                },
            );
        },
    };

    block.binary_condition = {
        init() {
            this.jsonInit?.(
                {
                    type: 'binary_condition',
                    message0: tr('blockly.blocks.binary_condition.message'),
                    args0: [
                        {
                            type: 'input_value',
                            name: 'Service',
                            check: 'Binary_sensor',
                        },
                        {
                            type: 'field_dropdown',
                            name: 'State',
                            options: [
                                [
                                    'ON',
                                    'on',
                                ],
                                [
                                    'OFF',
                                    'off',
                                ],
                            ],
                        },
                    ],
                    inputsInline: true,
                    previousStatement: 'Condition',
                    nextStatement: 'Condition',
                    colour: COLORS.HUE_YELLOW,
                    tooltip: tr('blockly.blocks.binary_condition.tooltip'),
                    helpUrl: '',
                },
            );
        },
    };

    /**
     * Catégorie Action
     */
    block.delay_action = {
        init() {
            this.jsonInit?.(
                {
                    type: 'delay_action',
                    message0: tr('blockly.blocks.delay_action.message'),
                    args0: [
                        {
                            type: 'field_number',
                            name: 'Hour',
                            value: 0,
                            min: 0,
                            max: 23,
                        },
                        {
                            type: 'field_number',
                            name: 'Minute',
                            value: 0,
                            min: 0,
                            max: 59,
                        },
                        {
                            type: 'field_number',
                            name: 'Second',
                            value: 0,
                            min: 0,
                            max: 59,
                        },
                    ],
                    inputsInline: false,
                    previousStatement: 'Action',
                    nextStatement: 'Action',
                    colour: COLORS.HUE_ORANGE,
                    tooltip: tr('blockly.blocks.delay_action.tooltip'),
                    helpUrl: '',
                },
            );
        },
    };

    /**
     * Catégorie Contrôle de lampe
     */
    block.color_picker = {
        init() {
            this.jsonInit?.(
                {
                    type: 'color_picker',
                    message0: tr('blockly.blocks.color_picker.message'),
                    args0: [
                        {
                            type: 'field_colour',
                            name: 'Color',
                            colour: '#ff0000',
                        },
                    ],
                    output: 'Color',
                    colour: COLORS.HUE_MAUVE,
                    tooltip: tr('blockly.blocks.color_picker.tooltip'),
                    helpUrl: '',
                },
            );
        },
    };

    block.color_rgb = {
        init() {
            this.jsonInit?.({
                type: 'color_rgb',
                message0: tr('blockly.blocks.color_rgb.message'),
                args0: [
                    {
                        type: 'input_dummy',
                    },
                    {
                        type: 'field_number',
                        name: 'Red',
                        value: 0,
                        min: 0,
                        max: 255,
                    },
                    {
                        type: 'field_number',
                        name: 'Green',
                        value: 0,
                        min: 0,
                        max: 255,
                    },
                    {
                        type: 'field_number',
                        name: 'Blue',
                        value: 0,
                        min: 0,
                        max: 255,
                    },
                ],
                output: 'Color',
                colour: COLORS.HUE_MAUVE,
                tooltip: tr('blockly.blocks.color_rgb.tooltip'),
                helpUrl: '',
            });
        },
    };

    block.brightness = {
        init() {
            this.jsonInit?.({
                type: 'brightness',
                message0: tr('blockly.blocks.brightness.message'),
                args0: [
                    {
                        type: 'field_number',
                        name: 'Brightness',
                        value: 0,
                        min: 0,
                        max: 255,
                    },
                ],
                output: 'Brightness',
                colour: COLORS.HUE_MAUVE,
                tooltip: tr('blockly.blocks.brightness.tooltip'),
                helpUrl: '',
            });
        },
    };

    block.color_temp = {
        init() {
            this.jsonInit?.({
                type: 'color_temp',
                message0: tr('blockly.blocks.color_temp.message'),
                args0: [
                    {
                        type: 'field_number',
                        name: 'Temperature',
                        value: 153,
                        min: 153,
                        max: 500,
                    },
                ],
                output: 'ColorTemperature',
                colour: COLORS.HUE_MAUVE,
                tooltip: tr('blockly.blocks.color_temp.tooltip'),
                helpUrl: '',
            });
        },
    };
})(Blockly.Blocks as unknown as BlocksDefinitions);
