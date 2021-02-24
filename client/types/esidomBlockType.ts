import type { Block } from 'blockly';

export interface EsidomBlockType extends Block {
    objectActionUpdateShape: (index: number)=> void;
    numericStateConditionUpdateAttribute: (entityId: string)=> void;
    numericStateConditionUpdateCondition: (option: string)=> void;
}
