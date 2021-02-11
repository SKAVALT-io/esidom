<script lang="ts">
    import './esidom_blocks';
    import './esidom_generator';
    import './esidom_const';
    import Blockly from 'blockly';
    import BlocklyComponent from './BlocklyComponent.svelte';
</script>

<div id="test">
    <BlocklyComponent>
        <category name="Declencheurs" colour={Blockly.Msg.HUE_GREEN}>
            <block type="binary_trigger" />
            <block type="time" />
        </category>
        <category name="Conditions" colour={Blockly.Msg.HUE_YELLOW}>
            <block type="time_condition" />
            <block type="time_condition_hour" />
            <block type="time_condition_week" />
            <block type="binary_condition" />
        </category>
        <category name="Actions" colour={Blockly.Msg.HUE_ORANGE}>
            <category name="Services" colour={Blockly.Msg.HUE_ORANGE}>
                <block type="action" />
                <!-- <block type="services"></block> -->
            </category>
        </category>
        <category name="Objets" colour={Blockly.Msg.HUE_RED}>
            <!-- <block type="lamps"></block> -->
            <!-- <block type="binary_sensors"></block> -->
            <block type="objet_action" />
        </category>
        <category name="Couleur" colour={Blockly.Msg.HUE_MAUVE}>
            <block type="color_picker" />
            <block type="color_rgb" />
        </category>
    </BlocklyComponent>
</div>

<style>
    #cool {
        margin: 0 20%;
    }

    #test {
        margin-left: 4%;
    }
</style>
