import type { Block } from 'blockly';

export interface EsidomBlockType extends Block {
    objectActionUpdateShape: (entityId: string)=> void;
    numericStateConditionUpdateAttribute: (entityId: string)=> void;
    numericStateConditionUpdateCondition: (option: string)=> void;
    intervalTriggerUpdateShape: (time: string)=> void;
}
