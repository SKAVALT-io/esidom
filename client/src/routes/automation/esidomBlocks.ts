/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
import Blockly from 'blockly';
import COLORS from './esidomConst';
import type { EntityTypeEnum } from './esidomGenerator';

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
    time_condition: BlockFunctions;
    sun_condition: BlockFunctions;
    time_condition_hour: BlockFunctions;
    time_condition_week: BlockFunctions;
    binary_condition: BlockFunctions;
    action: BlockFunctions;
    color_picker: BlockFunctions;
    color_rgb: BlockFunctions;
    object_action: BlockFunctions;
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
                    message0: 'Quels sont les déclencheurs ? %1 Sous quelles conditions ? %2 Que faire ? %3', // 'Avec quel mode ? %4',
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
                    tooltip: '',
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
                    type: 'block_type',
                    message0: 'Quand le capteur %1 passe à %2',
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
                    tooltip: '',
                    helpUrl: '',
                },
            );
        },
    };

    block.time_trigger = {
        init() {
            this.jsonInit?.(
                {
                    type: 'time',
                    message0: '%1 h %2 %3 m %4 %5 s',
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
                    tooltip: '',
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
                    message0: 'Début : %1 h %2 m %3 s %4 Fin : %5 h %6 m %7 s %8 %9 lundi %10 %11 mardi %12 %13 mercredi %14 %15 jeudi %16 %17 vendredi %18 %19 samedi %20 %21 dimanche',
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
                    tooltip: '',
                    helpUrl: '',
                },
            );
        },
    };

    block.sun_condition = {
        init() {
            this.jsonInit?.(
                {
                    type: 'sun_state',
                    message0: 'Lorsque le soleil se %1',
                    args0: [
                        {
                            type: 'field_dropdown',
                            name: 'Sun.sun',
                            options: [
                                [
                                    'lève',
                                    'above_horizon',
                                ],
                                [
                                    'couche',
                                    'below_horizon',
                                ],
                            ],
                        },
                    ],
                    previousStatement: 'Condition',
                    nextStatement: 'Condition',
                    colour: COLORS.HUE_YELLOW,
                    tooltip: '',
                    helpUrl: '',
                },
            );
        },
    };

    block.time_condition_hour = {
        init() {
            this.jsonInit?.({
                type: 'time_condition_2',
                lastDummyAlign0: 'RIGHT',
                message0: 'Début : %1 h %2 m %3 s %4 Fin : %5 h %6 m %7 s',
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
                tooltip: "Si laissé seul, la condition s'appliquera tous les jours",
                helpUrl: '',
            });
        },
    };

    block.time_condition_week = {
        init() {
            this.jsonInit?.(
                {
                    type: 'week_condition',
                    message0: '%1 lundi %2 %3 mardi %4 %5 mercredi %6 %7 jeudi %8 %9 vendredi %10 %11 samedi %12 %13 dimanche',
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
                    tooltip: "Si laissé seul, la condition s'appliquera à n'importe quel moment de la journée",
                    helpUrl: '',
                },
            );
        },
    };

    block.binary_condition = {
        init() {
            this.jsonInit?.(
                {
                    type: 'block_type',
                    message0: 'Si le capteur %1 est à %2',
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
                    tooltip: '',
                    helpUrl: '',
                },
            );
        },
    };

    /**
 * Catégorie Action
 */

    /**
 * Catégorie Couleur
 */
    block.color_picker = {
        init() {
            this.jsonInit?.(
                {
                    type: 'attribut_color',
                    message0: 'Couleur : %1',
                    args0: [
                        {
                            type: 'field_colour',
                            name: 'Color',
                            colour: '#ff0000',
                        },
                    ],
                    output: 'Color',
                    colour: COLORS.HUE_MAUVE,
                    tooltip: '',
                    helpUrl: '',
                },
            );
        },
    };

    block.color_rgb = {
        init() {
            this.jsonInit?.({
                type: 'color_rgb',
                message0: 'Couleur personnalisée : %1 rouge : %2 vert : %3 bleu %4',
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
                tooltip: 'Les valeurs doivent être comprise entre 0 et 255',
                helpUrl: '',
            });
        },
    };
})(Blockly.Blocks as unknown as BlocksDefinitions);
