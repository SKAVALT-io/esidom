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

        blocklyService = new BlocklyService(workspace);

        entityPromise = BlocklyService.initBlockly();
    });

    function loadAutomation() {
        const test_json: Automation = {
            id: '0',
            state: 'on',
            trigger: [
                {
                    platform: 'state',
                    entity_id: 'binary_sensor.0x00158d0003cc152c_contact',
                    from: 'on',
                    to: 'off',
                },
            ],
            condition: [
                {
                    condition: 'time',
                    weekday: ['mon', 'tue', 'wed', 'thu', 'fri'],
                    after: '0:0:0',
                    before: '0:0:0',
                },
            ],
            action: [
                {
                    alias: '20:light.zipato_bulb_2_level:Lampe Z-wave Zipato',
                    entity_id: 'light.zipato_bulb_2_level',
                    service: 'light.turn_off',
                },
            ],
            mode: 'single',
            name: 'test',
            description: 'test description',
        };
        const xml = BlocklyService.automationToXml(test_json);
        blocklyService.loadAutomation(xml);
    }
</script>

<BorderedButton
    on:click={() => loadAutomation()}
    text="(TO BE REMOVED OR REPLACED) LOAD AUTOMATION"
/>

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
