import Blockly from 'blockly';
import EsidomGenerator from '../routes/automation/esidom_generator.js';

export default class BlocklyService {
    toolbox: string | HTMLElement | undefined;

    workspace: Blockly.WorkspaceSvg;

    constructor(toolbox: string | HTMLElement | undefined, workspace: Blockly.WorkspaceSvg) {
        this.toolbox = toolbox,
        this.workspace = workspace;
    }

    convertToBlock() {
        window.LoopTrap = 1000;
        Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
        const code = EsidomGenerator.workspaceToCode(this.workspace);
        Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
        try {
            const json = JSON.parse(code);
            json.alias = 'test 3';
            json.description = 'test description';
            console.log(JSON.stringify(json));
        } catch (e) {
            alert(e);
        }
    }
}
