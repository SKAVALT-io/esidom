<script lang="ts">
    // Execute blocks definition
    import './esidomBlocks';
    import { onMount } from 'svelte';
    import Blockly from 'blockly';
    import type { BlocklyOptions } from 'blockly';
    import BlocklyService from '../../services/blocklyService';
    import { tr } from '../../utils/i18nHelper';
    import BorderedButton from '../../components/UI/buttons/BorderedButton.svelte';

    let blocklyService: BlocklyService;
    let entityPromise: Promise<void>;

    onMount(async () => {
        const toolbox: HTMLElement | undefined =
            document.getElementById('toolbox') || undefined;

        const options: BlocklyOptions = {
            toolbox: toolbox,
            collapse: false,
            comments: false,
            disable: false,
            //maxBlocks: Infinity, // Infinity not a number
            trashcan: true,
            horizontalLayout: false,
            toolboxPosition: 'start',
            css: true,
            media: 'https://blockly-demo.appspot.com/static/media/',
            rtl: false,
            //scrollbars: false, // don't existe in type declaration
            sounds: true,
            oneBasedIndex: true,
            grid: {
                spacing: 20,
                length: 1,
                colour: '#888',
                snap: false,
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1.2,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2,
            },
        };

        const workspace: Blockly.WorkspaceSvg = Blockly.inject(
            'blocklyDiv',
            options
        );

        const rootBlock: string =
            '<xml><block type="esidom_automation" deletable="false" movable="false"></block></xml>';
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(rootBlock), workspace);

        blocklyService = new BlocklyService(toolbox, workspace);

        entityPromise = BlocklyService.initBlockly();
    });
</script>

<div>
    {#await entityPromise}
        <p>{tr('blockly.loading')}</p>
        <div id="blocklyDivHide" />
    {:then}
        <p class="py-4">
            <BorderedButton
                on:click={() => blocklyService.convertToBlock()}
                text={tr('blockly.convertBlock')}
            />
        </p>
    {:catch}
        <p style="color: red">{tr('blockly.loadingError')}</p>
        <div id="blocklyDivHide" />
    {/await}
    <div id="blocklyDiv" />
    <xml id="toolbox" style="display: none">
        <slot />
    </xml>
</div>

<style scoped>
    #blocklyDivHide {
        position: absolute;
        height: 700px;
        width: 100%;
        text-align: left;
        background-color: #120639;
        z-index: 90;
    }

    #blocklyDiv {
        position: absolute;
        height: 600px;
        width: 90%;
        text-align: left;
    }
</style>
