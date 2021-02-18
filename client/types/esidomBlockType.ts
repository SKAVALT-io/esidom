import type { Block } from 'blockly';

export interface EsidomBlockType extends Block {
    objectActionUpdateShape: (index: number)=> void;
}
