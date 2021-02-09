<script lang="ts">
    import Blockly from 'blockly';

    import { onMount } from 'svelte';
    import './esidom_blocks';
    import './esidom_generator';

    onMount(() => {
        const toolbox = document.getElementById("toolbox") || undefined;

        const options = {
            toolbox: toolbox,
            collapse: false,
            comments: false,
            disable: false,
            maxBlocks: Infinity,
            trashcan: true,
            horizontalLayout: false,
            toolboxPosition: "start",
            css: true,
            media: "https://blockly-demo.appspot.com/static/media/",
            rtl: false,
            scrollbars: false,
            sounds: true,
            oneBasedIndex: true,
            grid: {
                spacing: 20,
                length: 1,
                colour: "#888",
                snap: false,
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2,
            },
        };

        const workspace = Blockly.inject("blocklyDiv", options);
        const rootBlock = '<xml><block type="automation" deletable="false" movable="false"></block></xml>';
        Blockly.Xml.domToWorkspace(
            Blockly.Xml.textToDom(rootBlock),
            workspace
        );
    });
</script>

<div id="test">
    <div id="blocklyDiv" style="height: 600px;" />
    <xml id="toolbox" style="display: none">
        <category name="Logic" colour="300">
            <block type="controls_if" />
            <block type="logic_compare" />
            <block type="logic_operation" />
            <block type="logic_negate" />
            <block type="logic_boolean" />
        </category>
        <category name="Declencheurs" colour="100">
            <block type="binary_trigger"></block>
            <block type="time"></block>
        </category>
        <category name="Conditions" colour="150">
            <block type="time_condition"></block>
            <block type="time_condition_hour"></block>
            <block type="time_condition_week"></block>
            <block type="binary_condition"></block>
        </category>
        <category name="Actions" colour="200">
            <category name="Services" colour="200">
                <block type="action"></block>
                <!-- <block type="services"></block> -->
            </category>
        </category>
        <category name="Objets" colour="50">
            <!-- <block type="lamps"></block> -->
            <!-- <block type="binary_sensors"></block> -->
            <!-- <block type="objet_action"></block> -->
        </category>
        <category name="Couleur" colour="75">
            <block type="color_picker"></block>
            <block type="color_rgb"></block>
        </category>
    </xml>
</div>

<style>
    #cool {
        margin: 0 20%;
    }

    #test {
        margin-left: 4%;
    }
</style>
