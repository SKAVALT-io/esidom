/* eslint-disable no-param-reassign */
import type { WorkspaceSvg } from 'blockly';
import Blockly from 'blockly';
import esidomGenerator, { EntityTypeEnum } from '../routes/automation/esidomGenerator';
import EntityService from './entityService';
import type { Entity } from '../../types/entityType';
import type { Service } from '../../types/serviceType';
import type { EntityWithServices } from '../../types/entityWithServicesType';
import type { BlocksDefinitions } from '../routes/automation/esidomBlocks';
import COLORS from '../routes/automation/esidomConst';
import BlocklyObjects from '../routes/automation/blocklyObject';
import type { ObjectBlock } from '../../types/objectsBlockType';
import type { Automation } from '../../types/automationType';
import type { EsidomBlockType } from '../../types/esidomBlockType';
import EsidomBlockGenerator from '../routes/automation/esidomBlockGenerator';
import { tr } from '../utils/i18nHelper';
import type { EntityWithAttributes } from '../../types/entityWithAttributesTypes';

interface Type {
    name: EntityTypeEnum;
    friendlyName: string
}

const TYPES: Type[] = [
    {
        name: 'binary_sensor',
        friendlyName: 'blockly.blocks.blocks_by_type.binarySensor',
    },
    {
        name: 'person',
        friendlyName: 'blockly.blocks.blocks_by_type.person',
    },
    {
        name: 'weather',
        friendlyName: 'blockly.blocks.blocks_by_type.weather',
    },
    {
        name: 'zwave',
        friendlyName: 'blockly.blocks.blocks_by_type.zwave',
    },
    {
        name: 'sensor',
        friendlyName: 'blockly.blocks.blocks_by_type.sensor',
    },
    {
        name: 'light',
        friendlyName: 'blockly.blocks.blocks_by_type.light',
    },
    {
        name: 'automation',
        friendlyName: 'blockly.blocks.blocks_by_type.automation',
    },
    {
        name: 'switch',
        friendlyName: 'blockly.blocks.blocks_by_type.switch',
    },
    {
        name: 'media_player',
        friendlyName: 'blockly.blocks.blocks_by_type.mediaPlayer',
    },
];

export default class BlocklyService {
    private workspace: WorkspaceSvg;

    constructor(workspace: WorkspaceSvg) {
        this.workspace = workspace;
    }

    convertToBlock(name: string, description: string, id?: string): Automation {
        const code = esidomGenerator.workspaceToCode(this.workspace);

        try {
            const automationTmp = JSON.parse(code);
            const automation: Automation = {
                id: id ?? `automation.${name.toLowerCase().replace(/ /g, '_')}`,
                name,
                description: description ?? '',
                action: automationTmp.action ?? [],
                condition: automationTmp.condition ?? [],
                trigger: automationTmp.trigger ?? [],
                mode: 'single',
                state: 'on',
            };

            console.log(automation);
            return automation;
        } catch (e) {
            const a : Automation = {
                id: '',
                name: '',
                state: '',
                action: [],
                trigger: [],
                condition: [],
                description: '',
                mode: 'parallel',
            };
            return a;
        }
    }

    loadAutomation(xml: string): void {
        Blockly.mainWorkspace.clear();
        const block: Element = Blockly.Xml.textToDom(xml);
        Blockly.Xml.domToWorkspace(block, this.workspace);
    }

    static async initBlockly(): Promise<void> {
        const entities = await EntityService.getEntities();
        const services = await EntityService.getServices();

        // We create the object_action Block
        this.createObjectAction((entities as Entity<string[]>[]), services);

        // We create all the object Blocks
        this.createObjects(entities);

        // We create the numeric_state_condition Block
        this.createNumericStateCondition((entities as Entity<string[]>[]));

        // We create the numeric_state_trigger Block
        this.createNumericStateTrigger((entities as Entity<string[]>[]));
    }

    static createNumericEntityWithAttributesMap(
        entities: Entity<string[]>[],
    ): Map<string, EntityWithAttributes> {
        const entityWithAttributesMap = new Map<string, EntityWithAttributes>();

        entities.forEach((entity: Entity<string[]>) => {
            entityWithAttributesMap.set(entity.id, {
                id: entity.id,
                name: entity.name,
                attributes: Object.keys(entity.attributes),
            });
        });

        return entityWithAttributesMap;
    }

    static createNumericDropdowns(
        entityWithAttributesMap: Map<string, EntityWithAttributes>,
    ): string[][][] {
        const dropdowns = [];

        const values = Array.from(entityWithAttributesMap.values());
        const tmpDropdown1 = values.map((
            entity: EntityWithAttributes,
        ) => {
            if (entity.name === null || entity.name === '') {
                entity.name = tr('blockly.unknownName');
            }
            return [entity.name, entity.id];
        });

        const dropdown1 = tmpDropdown1.length > 0 ? tmpDropdown1 : [[tr('blockly.unknownName'), tr('blockly.unknownName')]];
        const dropdown2 = values[0]
            .attributes.map((attribute: string) => [attribute, attribute])
            ?? [[tr('blockly.unknownAttribute'), tr('blockly.unknownAttribute')]];

        dropdown2.unshift([tr('blockly.noAttribute'), 'noAttribute']);

        const dropdown3 = [
            [tr('blockly.blocks.numeric_state_condition.dropdown3.included'), 'included'],
            [tr('blockly.blocks.numeric_state_condition.dropdown3.notIncluded'), 'notIncluded'],
            [tr('blockly.blocks.numeric_state_condition.dropdown3.greater'), 'greater'],
            [tr('blockly.blocks.numeric_state_condition.dropdown3.lower'), 'lower'],
        ];

        dropdowns.push(dropdown1, dropdown2, dropdown3);
        return dropdowns;
    }

    static registerNumericMutator(
        entityWithAttributesMap: Map<string, EntityWithAttributes>,
        mutatorName: string,
        inputName: string,
    ):void {
        const NUMERIC_STATE_MUTATOR_MIXIN = {

            mutationToDom(): HTMLElement {
                const container = document.createElement('mutation');
                const entitiesInput: string = (this as EsidomBlockType).getFieldValue('Entities');
                container.setAttribute(inputName, entitiesInput);
                return container;
            },

            domToMutation(xmlElement: HTMLElement): void {
                const attribute = xmlElement.getAttribute(inputName);
                const entityId = attribute != null ? attribute : '';
                this.numericStateConditionUpdateAttribute(entityId);
            },

            numericStateConditionUpdateAttribute(entityId: string): void {
                const newDropdown = entityWithAttributesMap.get(entityId)
                    ?.attributes.map((attribute: string) => [attribute, attribute])
                    ?? [[tr('blockly.unknownAttribute'), tr('blockly.unknownAttribute')]];

                newDropdown.unshift([tr('blockly.noAttribute'), 'noAttribute']);

                const attInput = (this as EsidomBlockType).getInput?.('entities');
                attInput.removeField('Attributes', true);
                attInput.appendField(new Blockly.FieldDropdown(newDropdown), 'Attributes');
            },

            numericStateConditionUpdateCondition(option: string): void {
                const includedField = (this as EsidomBlockType).getFieldValue('Included');

                if (
                    (option === 'included' || option === 'notIncluded')
                    && (includedField !== 'included' && includedField !== 'notIncluded')
                ) {
                    (this as EsidomBlockType).removeInput('condition', true);
                    (this as EsidomBlockType).appendDummyInput('condition')
                        .appendField(tr('blockly.blocks.numeric_state_trigger.between'))
                        .appendField(new Blockly.FieldNumber(0), 'Minimum')
                        .appendField(tr('blockly.blocks.numeric_state_trigger.and'))
                        .appendField(new Blockly.FieldNumber(0), 'Maximum');
                } else if (option === 'greater') {
                    (this as EsidomBlockType).removeInput('condition', true);
                    (this as EsidomBlockType).appendDummyInput('condition')
                        .appendField(tr('blockly.blocks.numeric_state_trigger.of'))
                        .appendField(new Blockly.FieldNumber(0), 'Minimum');
                } else if (option === 'lower') {
                    (this as EsidomBlockType).removeInput('condition', true);
                    (this as EsidomBlockType).appendDummyInput('condition')
                        .appendField(tr('blockly.blocks.numeric_state_trigger.of'))
                        .appendField(new Blockly.FieldNumber(0), 'Maximum');
                }
            },

        };

        const NUMERIC_STATE_MUTATOR_EXTENSION = function mutate(this: EsidomBlockType) {
            this.getField('Included').setValidator((option: string) => {
                this.numericStateConditionUpdateCondition(option);
            });

            this.getField('Entities').setValidator((option: string) => {
                this.numericStateConditionUpdateAttribute(option);
            });
        };

        try {
            Blockly.Extensions.registerMutator(
                mutatorName,
                NUMERIC_STATE_MUTATOR_MIXIN,
                NUMERIC_STATE_MUTATOR_EXTENSION,
            );
        } catch (error) {
            console.log(error);
        }
    }

    static createNumericStateTrigger(entities: Entity<string[]>[]): void {
        const entityWithAttributesMap = this.createNumericEntityWithAttributesMap(entities);
        const dropdowns = this.createNumericDropdowns(entityWithAttributesMap);

        const block = Blockly.Blocks as unknown as BlocksDefinitions;
        block.numeric_state_trigger = {
            init() {
                this.jsonInit?.(
                    {
                        type: 'numeric_state_trigger',
                        message0: tr('blockly.blocks.numeric_state_trigger.message'),
                        args0: [
                            {
                                type: 'field_dropdown',
                                name: 'Entities',
                                options: dropdowns[0],
                            },
                            {
                                type: 'field_dropdown',
                                name: 'Attributes',
                                options: dropdowns[1],
                            },
                            {
                                type: 'input_dummy',
                                name: 'entities',
                            },
                            {
                                type: 'field_dropdown',
                                name: 'Included',
                                options: dropdowns[2],
                            },
                            {
                                type: 'input_dummy',
                                name: 'included',
                            },
                            {
                                type: 'field_number',
                                name: 'Minimum',
                                value: 0,
                            },
                            {
                                type: 'field_number',
                                name: 'Maximum',
                                value: 0,
                            },
                            {
                                type: 'input_dummy',
                                name: 'condition',
                            },
                        ],
                        inputsInline: false,
                        previousStatement: 'Trigger',
                        nextStatement: 'Trigger',
                        colour: COLORS.HUE_GREEN,
                        tooltip: tr('blockly.blocks.numeric_state_trigger.tooltip'),
                        helpUrl: '',
                        mutator: 'numeric_static_trigger_esidom_mutator',
                    },
                );
            },
        };

        this.registerNumericMutator(
            entityWithAttributesMap,
            'numeric_static_trigger_esidom_mutator',
            'numeric_state_trigger_entities_input',
        );
    }

    static createNumericStateCondition(entities: Entity<string[]>[]): void {
        const entityWithAttributesMap = this.createNumericEntityWithAttributesMap(entities);
        const dropdowns = this.createNumericDropdowns(entityWithAttributesMap);

        const block = Blockly.Blocks as unknown as BlocksDefinitions;
        block.numeric_state_condition = {
            init() {
                this.jsonInit?.(
                    {
                        type: 'numeric_state_condition',
                        message0: tr('blockly.blocks.numeric_state_condition.message'),
                        args0: [
                            {
                                type: 'field_dropdown',
                                name: 'Entities',
                                options: dropdowns[0],
                            },
                            {
                                type: 'field_dropdown',
                                name: 'Attributes',
                                options: dropdowns[1],
                            },
                            {
                                type: 'input_dummy',
                                name: 'entities',
                            },
                            {
                                type: 'field_dropdown',
                                name: 'Included',
                                options: dropdowns[2],
                            },
                            {
                                type: 'input_dummy',
                                name: 'included',
                            },
                            {
                                type: 'field_number',
                                name: 'Minimum',
                                value: 0,
                            },
                            {
                                type: 'field_number',
                                name: 'Maximum',
                                value: 0,
                            },
                            {
                                type: 'input_dummy',
                                name: 'condition',
                            },
                        ],
                        inputsInline: false,
                        previousStatement: 'Condition',
                        nextStatement: 'Condition',
                        colour: COLORS.HUE_YELLOW,
                        tooltip: tr('blockly.blocks.numeric_state_condition.tooltip'),
                        helpUrl: '',
                        mutator: 'numeric_static_condition_esidom_mutator',
                    },
                );
            },
        };

        this.registerNumericMutator(
            entityWithAttributesMap,
            'numeric_static_condition_esidom_mutator',
            'numeric_state_condition_entities_input',
        );
    }

    static createObjectAction(entities: Entity<string[]>[], services: Service[]): void {
        const entityWithServicesMap = new Map<string, EntityWithServices>();

        entities.forEach((entity: Entity<string[]>) => {
            const tmpServices: string[] = services
                .filter((service: Service) => service.name.split('.')[0] === entity.type)
                .map((service: Service) => service.name);

            if (tmpServices.length > 0) {
                entityWithServicesMap.set(entity.id, {
                    id: entity.id,
                    name: entity.name,
                    services: tmpServices,
                });
            }
        });

        const block = Blockly.Blocks as unknown as BlocksDefinitions;
        // Create object_action Block
        block.object_action = {
            init() {
                const values = Array.from(entityWithServicesMap.values());
                const tmpDropdown1 = values.map((
                    entity: EntityWithServices,
                ) => {
                    if (entity.name === null || entity.name === '') {
                        entity.name = tr('blockly.unknownName');
                    }
                    return [entity.name, entity.id];
                });

                const dropdown1 = tmpDropdown1.length > 0 ? tmpDropdown1 : [[tr('blockly.unknownName'), tr('blockly.unknownName')]];
                const dropdown2 = values[0]
                    .services.map((service: string) => [service.split('.')[1], service])
                ?? [[tr('blockly.unknownAction'), tr('blockly.unknownAction')]];

                this.jsonInit?.(
                    {
                        type: 'object_action',
                        message0: tr('blockly.blocks.object_action.message'),
                        args0: [
                            {
                                type: 'field_dropdown',
                                name: 'Entities',
                                options: dropdown1,
                            },
                            {
                                type: 'input_dummy',
                                name: 'entities',
                            },
                            {
                                type: 'field_dropdown',
                                name: 'Services',
                                options: dropdown2,
                            },
                            {
                                type: 'input_dummy',
                                name: 'services',
                            },
                        ],
                        inputsInline: false,
                        previousStatement: 'Action',
                        nextStatement: 'Action',
                        colour: COLORS.HUE_ORANGE,
                        tooltip: tr('blockly.blocks.object_action.tooltip'),
                        helpUrl: '',
                        mutator: 'object_action_esidom_mutator',
                    },
                );
            },
        };

        const OBJECT_ACTION_MUTATOR_MIXIN = {

            mutationToDom(): HTMLElement {
                const container = document.createElement('mutation');
                const entitiesInput: string = (this as EsidomBlockType).getFieldValue('Entities');
                container.setAttribute('entities_input', entitiesInput);
                return container;
            },

            domToMutation(xmlElement: HTMLElement): void {
                const attribute = xmlElement.getAttribute('entities_input');
                const entityId = attribute != null ? attribute : '';
                this.objectActionUpdateShape(entityId);
            },

            objectActionUpdateShape(entityId: string): void {
                const type = entityId.split('.')[0];
                const entityServices = entityWithServicesMap.get(entityId)?.services;
                const newDropdown = entityServices?.map((service: string) => [service.split('.')[1], service])
                    ?? [[tr('blockly.unknownAction'), tr('blockly.unknownAction')]];

                const serviceInput = (this as EsidomBlockType).getInput?.('services');
                serviceInput.removeField('Services', true);
                serviceInput.appendField(new Blockly.FieldDropdown(newDropdown), 'Services');

                const entityField = (this as EsidomBlockType).getFieldValue('Entities');
                const currentType = entityField.split('.')[0];

                if (type === 'light' && currentType !== 'light') {
                    (this as EsidomBlockType).removeInput('Color', true);
                    (this as EsidomBlockType).appendValueInput('Color')
                        .setCheck('Color')
                        .appendField(tr('blockly.blocks.object_action.color'));
                    (this as EsidomBlockType).removeInput('Brightness', true);
                    (this as EsidomBlockType).appendValueInput('Brightness')
                        .setCheck('Brightness')
                        .appendField(tr('blockly.blocks.object_action.brightness'));
                    (this as EsidomBlockType).removeInput('Temperature', true);
                    (this as EsidomBlockType).appendValueInput('Temperature')
                        .setCheck('ColorTemperature')
                        .appendField(tr('blockly.blocks.object_action.temperature'));
                } else if (type !== 'light') {
                    (this as EsidomBlockType).removeInput('Color', true);
                    (this as EsidomBlockType).removeInput('Brightness', true);
                    (this as EsidomBlockType).removeInput('Temperature', true);
                }
            },
        };

        const OBJECT_ACTION_MUTATOR_EXTENSION = function mutate(this: EsidomBlockType) {
            this.getField('Entities').setValidator((option: string) => {
                this.objectActionUpdateShape(option);
            });
        };

        try {
            Blockly.Extensions.registerMutator(
                'object_action_esidom_mutator',
                OBJECT_ACTION_MUTATOR_MIXIN,
                OBJECT_ACTION_MUTATOR_EXTENSION,
            );
        } catch (error) {
            console.log(error);
        }
    }

    static createObjects(entities: Entity<unknown>[]): void {
        const block = Blockly.Blocks as unknown as BlocksDefinitions;
        TYPES.forEach((type: Type) => {
            const typeName = type.name;
            const options: string[][] = entities
                .filter((entity: Entity<unknown>) => entity.type === typeName)
                .map((entity: Entity<unknown>) => [entity.name === '' ? tr('blockly.unknownName') : entity.name, entity.id]);

            const blocklyObjects = new BlocklyObjects(
                typeName,
                typeName.charAt(0).toUpperCase() + typeName.slice(1),
                tr(type.friendlyName),
                parseInt(COLORS.HUE_RED, 10),
                tr('blockly.blocks.blocks_by_type.tooltip') + tr(type.friendlyName),
            );

            blocklyObjects.addOptions(options.length !== 0 ? options : [[tr('blockly.unknownName'), tr('blockly.unknownName')]]);
            const objectBlock: ObjectBlock = blocklyObjects.getJson();

            // Create object Block
            block[type.name] = {
                init() {
                    this.jsonInit?.(objectBlock);
                },
            };
        });
    }

    static automationToXml(automation: Automation): string {
        let xml = `
            <xml xmlns="https://developers.google.com/blockly/xml">
            <block type="esidom_automation" deletable="false" movable="false">
        `;

        automation.trigger?.forEach((trigger) => {
            const plf = trigger.platform;

            xml += `
                <value name="Trigger">
                ${EsidomBlockGenerator.platform[plf](trigger)};
                </value>
            `;
        });

        automation.condition?.forEach((condition) => {
            const cdt = condition.condition;

            xml += `
                <value name="Condition">;
                ${EsidomBlockGenerator.condition[cdt](condition)}
                </value>
            `;
        });

        automation.action?.forEach((action) => {
            const entityId = action.entity_id;
            const { service } = action;

            const { data } = action;

            const rgbColor = data.rgb_color;
            const { brightness } = data;
            const colorTemp = data.color_temp;

            xml += `
                <value name="Action">
                <block type="object_action">
                    <field name="Entities">${entityId}</field>
                    <field name="Services">${service}</field>
                    ${this.getActionColorXml(rgbColor)}
                    ${this.getActionBrightnessXml(brightness)}
                    ${this.getActionTemperatureXml(colorTemp)}
                </block>
                </value>
            `;
        });

        xml += '</block></xml>';

        return xml;
    }

    static getActionColorXml(rgbColor: number[]): string {
        return rgbColor
            ? `
                '<value name="Color">
                    <block type="color_rgb">
                        <field name="Red">${rgbColor[0]}</field>
                        <field name="Green">${rgbColor[1]}</field>
                        <field name="Blue">${rgbColor[2]}</field>
                    </block>
                </value>'
            `
            : '';
    }

    static getActionBrightnessXml(brightness: number[]): string {
        return brightness
            ? `
                '<value name="Brightness">
                    <block type="brightness">
                        <field name="Brightness">${brightness}</field>
                    </block>
                </value>'
            `
            : '';
    }

    static getActionTemperatureXml(colorTemp: number[]): string {
        return colorTemp
            ? `
                '<value name="Temperature">
                    <block type="color_temp">
                        <field name="Temperature">${colorTemp}</field>
                    </block>
                </value>'
            `
            : '';
    }
}
