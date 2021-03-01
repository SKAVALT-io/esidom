<script lang="ts">
    // Execute blocks definition
    import './esidomBlocks';
    import { onDestroy, onMount } from 'svelte';
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

    // Used for the scroll bar bug
    let observer: MutationObserver;
    onDestroy(() => {
        observer.disconnect();
        // Clear blockly workspace.
        blocklyService.clear();
    });

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
                minScale: 0.5,
                scaleSpeed: 1.2,
            },
            theme: {},
        };

        const esidomTheme: Blockly.Theme = new Blockly.Theme(
            'themeName',
            {}, //blockStyles

            {}, // categoryStyles

            {
                toolboxForegroundColour: '#000',
            } // componentStyles
        );

        const workspace: Blockly.WorkspaceSvg = Blockly.inject(
            'blocklyDiv',
            options
        );

        workspace.setTheme(esidomTheme);

        // Small hack to "fix" the toolbox scrollbar glitch
        // Setup a mutation observer to see if the class changes to detect
        // that it has been opened/close and act accordingly

        const bar = (workspace as any).toolbox_.flyout_.scrollbar
            .svgHandle_ as SVGElement;
        const displayBackup = bar.style.display;

        // Callback function to execute when mutations are observed
        const callback: MutationCallback = function (mutationsList) {
            mutationsList.forEach((mut) => {
                if (mut.type === 'attributes') {
                    if (mut.attributeName === 'aria-selected') {
                        const selected =
                            (mut.target as any).ariaSelected === 'true';
                        bar.style.display = selected ? displayBackup : 'none';
                    }
                }
            });
        };

        // Create an observer instance linked to the callback function
        observer = new MutationObserver(callback);
        // Config
        const mutConfig = { attributes: true };
        // Start observing the target node for configured mutations
        (workspace as any).toolbox_.contents_.forEach(
            (c: { htmlDiv_: HTMLElement }) =>
                observer.observe(c.htmlDiv_, mutConfig)
        );

        // toolbox bar hack end

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
        const creating = automationId === '';

        const automation = blocklyService.convertToAutomation(
            automationName,
            automationDesc,
            automationId === '' ? undefined : automationId
        );
        if (creating) {
            await AutomationService.postAutomation(automation);
        } else {
            await AutomationService.patchAutomation(automation);
        }

        // Don't go if request fail.
        push('/automations');
    }

    let automationName: string;
    let automationDesc: string;
</script>

<div class="pr-4">
    {#await entityPromise}
        <p>{tr('blockly.loading')}</p>
        <div
            id="blocklyDivHideAwait"
            class="absolute bg-esidom z-100 w-full h-vh-80"
        >
            <div id="loader" class="flex items-center justify-center">
                <LoadingAnimation />
            </div>
        </div>
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
