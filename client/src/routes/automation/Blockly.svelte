<script lang="ts">
    import BlocklyComponent from './BlocklyComponent.svelte';
    import COLORS from './esidom_const';
</script>

<div id="test">
    <BlocklyComponent>
        <category name="Déclencheurs" colour={COLORS.HUE_GREEN}>
            <block type="binary_trigger" />
            <block type="time" />
        </category>
        <category name="Conditions" colour={COLORS.HUE_YELLOW}>
            <block type="binary_condition" />
            <block type="time_condition" />
            <block type="time_condition_hour" />
            <block type="time_condition_week" />
        </category>
        <category name="Actions" colour={COLORS.HUE_ORANGE}>
            <block type="object_action" />
        </category>
        <category name="Objets" colour={COLORS.HUE_RED} />
        <category name="Couleur" colour={COLORS.HUE_MAUVE}>
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
