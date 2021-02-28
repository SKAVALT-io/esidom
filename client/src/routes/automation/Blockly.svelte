<script lang="ts">
    import BlocklyComponent from './BlocklyComponent.svelte';
    import COLORS from './esidomConst';

    // url param --> can be accessed via params.id
    // if id exists --> get /automation/id to edit routine
    // if id is undefined --> creating new automation
    export let params: { id: string };
</script>

<div class="pb-12">
    <BlocklyComponent automationId={params?.id ?? ''}>
        <category name="Déclencheurs" colour={COLORS.HUE_GREEN}>
            <block type="binary_trigger" />
            <block type="time_trigger" />
            <block type="sun_trigger" />
            <block type="numeric_state_trigger">
                <mutation numeric_state_trigger_entities_input="" />
            </block>
        </category>
        <category name="Conditions" colour={COLORS.HUE_YELLOW}>
            <block type="binary_condition" />
            <block type="time_condition" />
            <block type="time_condition_hour" />
            <block type="time_condition_week" />
            <block type="sun_condition" />
            <block type="numeric_state_condition">
                <mutation numeric_state_condition_entities_input="" />
            </block>
        </category>
        <category name="Actions" colour={COLORS.HUE_ORANGE}>
            <block type="object_action">
                <mutation entities_input="" />
            </block>
        </category>
        <category name="Objets" colour={COLORS.HUE_RED}>
            <block type="binary_sensor" />
            <block type="person" />
            <block type="weather" />
            <block type="zwave" />
            <block type="sensor" />
            <block type="light" />
            <block type="automation" />
            <block type="switch" />
            <block type="media_player" />
        </category>
        <category name="Contrôle de lampe" colour={COLORS.HUE_MAUVE}>
            <block type="color_picker" />
            <block type="color_rgb" />
            <block type="brightness" />
            <block type="color_temp" />
        </category>
    </BlocklyComponent>
</div>
