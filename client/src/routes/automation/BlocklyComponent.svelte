<script lang="ts">
    // Execute blocks definition
    import './esidom_blocks';
    import { onMount } from 'svelte';
    import Blockly from 'blockly';
    import BlocklyService from '../../services/blocklyService';

    let blocklyService: BlocklyService;

    onMount(async () => {
        const toolbox = document.getElementById('toolbox') || undefined;

        const workspace = Blockly.inject('blocklyDiv', {
            toolbox,
        });

        const rootBlock =
            '<xml><block type="automation" deletable="false" movable="false"></block></xml>';
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(rootBlock), workspace);

        blocklyService = new BlocklyService(toolbox, workspace);

        // TODO: correct asynchrone call
        await BlocklyService.createEntities();
    });
</script>

<p>
    <button on:click={blocklyService.convertToBlock()}>Convert the blocks !</button>
</p>

<div>
    <div id="blocklyDiv" />
    <xml id="toolbox" style="display:none">
        <slot />
    </xml>
</div>

<style scoped>
    #blocklyDiv {
        height: 600px;
        width: 100%;
        text-align: left;
    }
</style>
