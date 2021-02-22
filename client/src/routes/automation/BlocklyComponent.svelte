<script lang="ts">
    // Execute blocks definition
    import './esidomBlocks';
    import { onMount } from 'svelte';
    import Blockly from 'blockly';
    import type { BlocklyOptions } from 'blockly';
    import BlocklyService from '../../services/blocklyService';
    import { tr } from '../../utils/i18nHelper';
    import BorderedButton from '../../components/UI/buttons/BorderedButton.svelte';
    import type { Automation } from '../../../types/automationType';
    import AutomationService from '../../services/automationService';
    import { push } from 'svelte-spa-router';
    import LoadingAnimation from '../../components/animations/LoadingAnimation.svelte';

    export let automationId: string;

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
            trashcan: true,
            horizontalLayout: false,
            toolboxPosition: 'start',
            css: true,
            media: 'https://blockly-demo.appspot.com/static/media/',
            rtl: false,
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
                startScale: 1.1,
                maxScale: 2,
                minScale: 0.8,
                scaleSpeed: 1.2,
            },
        };

        const workspace: Blockly.WorkspaceSvg = Blockly.inject(
            'blocklyDiv',
            options
        );

        // This will fix the toolbox scrollbar glitch
        const display = document.createAttribute('display');
        display.value = 'none';
        workspace.toolbox_.flyout_.scrollbar.svgHandle_.attributes.setNamedItem(
            display
        );

        const rootBlock: string =
            '<xml><block type="esidom_automation" deletable="false" movable="false"></block></xml>';
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(rootBlock), workspace);

        blocklyService = new BlocklyService(workspace);

        entityPromise = BlocklyService.initBlockly().then((res) => {
            if (automationId !== '') {
                loadAutomation();
            }
        });
    });

    async function loadAutomation() {
        const automation: Automation = await AutomationService.getAutomationById(
            automationId
        );

        const xml = BlocklyService.automationToXml(automation);
        blocklyService.loadAutomation(xml);

        automationName = automation.name;
        automationDesc = automation.description;
    }

    async function handleSubmit() {
        const automation = blocklyService.convertToBlock(
            automationName,
            automationDesc,
            automationId === '' ? undefined : automationId
        );

        await AutomationService.postAutomation(automation);
        // Don't go if request fail.
        push('/automations');
    }

    let automationName: string;
    let automationDesc: string;
</script>

<div class="pr-4">
    {#await entityPromise}
        <p>{tr('blockly.loading')}</p>
        <LoadingAnimation />
        <div
            id="blocklyDivHideAwait"
            class="absolute bg-esidom z-100 w-full h-vh-80"
        />
    {:then}
        <form on:submit|preventDefault={handleSubmit}>
            <input
                class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 border border-blue-700 rounded"
                type="submit"
                value={tr('blockly.convertBlock')}
            />
            <input
                type="text"
                required
                placeholder={tr('blockly.automationName')}
                class="text-black"
                bind:value={automationName}
            />
            <input
                type="text"
                placeholder={tr('blockly.automationDesc')}
                class="text-black"
                bind:value={automationDesc}
            />
        </form>
        <br />
    {:catch}
        <p style="color: red">{tr('blockly.loadingError')}</p>
        <div
            id="blocklyDivHideError"
            class="absolute bg-esidom z-100 w-full h-vh-80"
        />
    {/await}
    <div id="blocklyDiv" class="h-vh-80" />
    <xml id="toolbox" style="display: none">
        <slot />
    </xml>
</div>

<!-- blocklyScrollbarHandle -->
