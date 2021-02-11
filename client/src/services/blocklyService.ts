import type { WorkspaceSvg } from 'blockly';
import esidomGenerator from '../routes/automation/esidom_generator';

export default class BlocklyService {
    private toolbox: string | HTMLElement | undefined;

    private workspace: WorkspaceSvg;

    constructor(toolbox: string | HTMLElement | undefined, workspace: WorkspaceSvg) {
        this.toolbox = toolbox;
        this.workspace = workspace;
    }

    convertToBlock(): void {
        const code = esidomGenerator.workspaceToCode(this.workspace);

        console.log(this.toolbox);

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
