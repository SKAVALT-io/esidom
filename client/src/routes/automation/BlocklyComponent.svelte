<script lang="ts">
    // Execute blocks definition
    import './esidom_blocks';
    import { onMount } from 'svelte';
    import Blockly from 'blockly';
    import BlocklyService from '../../services/blocklyService';

    let blocklyService: BlocklyService;
    let entityPromise: Promise<void>;

    onMount(async () => {
        const toolbox: HTMLElement | undefined =
            document.getElementById('toolbox') || undefined;

        const workspace: Blockly.WorkspaceSvg = Blockly.inject('blocklyDiv', {
            toolbox,
        });

        const rootBlock: string =
            '<xml><block type="automation" deletable="false" movable="false"></block></xml>';
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(rootBlock), workspace);

        blocklyService = new BlocklyService(toolbox, workspace);

        entityPromise = BlocklyService.createEntities();
    });
</script>

<div>
    {#await entityPromise}
        <p>Chargement de blockly ...</p>
        <div id="blocklyDivHide" />
    {:then}
        <p>
            <button on:click={blocklyService.convertToBlock()}>Convert the
                blocks !</button>
        </p>
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
    <div id="blocklyDiv" />
    <xml id="toolbox" style="display: none">
        <slot />
    </xml>
</div>

<style scoped>
    #blocklyDivHide {
        position: absolute;
        height: 600px;
        width: 100%;
        text-align: left;
        background-color: #120639;
        z-index: 100;
    }

    #blocklyDiv {
        position: absolute;
        height: 600px;
        width: 100%;
        text-align: left;
    }
</style>
