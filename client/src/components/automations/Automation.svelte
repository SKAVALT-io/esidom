<script lang="ts">
    import { push } from 'svelte-spa-router';
    import { onDestroy, onMount } from 'svelte';
    import type { AutomationPreview } from '../../../types/automationType';
    import AutomationService from '../../services/automationService';
    import RoundedButton from '../UI/buttons/RoundedButton.svelte';
    import ToggleButton from '../UI/buttons/ToggleButton.svelte';
    import { socketManager } from '../../managers/socketManager';
    import Tooltip from '../UI/utils/Tooltip.svelte';

    export let automation: AutomationPreview;

    $: checked = automation.state === 'on';

    let showTriggerTip: boolean = false;
    let showEditTip: boolean = false;

    function handleToggle() {
        checked = !checked;
        AutomationService.toggleAutomation(
            automation.id,
            checked ? 'on' : 'off'
        );
    }

    function handleEdit() {
        push(`/blockly/${automation.id}`);
    }

    function handleTrigger() {
        AutomationService.triggerAutomation(automation.id);
    }

    function automationUpdatedHandler(data: any) {
        automation = data;
    }

    onMount(async () => {
        socketManager.registerListener(
            'entity_updated',
            automation.id,
            automationUpdatedHandler
        );
    });

    onDestroy(() => {
        socketManager.removeListener(
            'entity_updated',
            automationUpdatedHandler
        );
    });
</script>

<div
    id="automation"
    class="rounded-lg items-center text-center grid grid-cols-8 px-1 py-4"
>
    <div class="col-span-1">
        <ToggleButton on:change={handleToggle} bind:checked />
    </div>
    <div class="content-center col-span-5">{automation.name}</div>
    <div
        id="trigger_button"
        class="col-span-1"
        on:touchstart={() => (showTriggerTip = true)}
        on:touchend={() => (showTriggerTip = false)}
        on:mouseleave={() => (showTriggerTip = false)}
        on:mouseenter={() => (showTriggerTip = true)}
    >
        <RoundedButton
            iconPath="icons/button/trigger.svg"
            size={8}
            on:click={handleTrigger}
        />
        <!-- <Tooltip text="Déclencher" position="top" show={showTriggerTip} /> -->
    </div>
    <div
        id="edit_button"
        class="col-span-1"
        on:touchstart={() => (showEditTip = true)}
        on:touchend={() => (showEditTip = false)}
        on:mouseleave={() => (showEditTip = false)}
        on:mouseenter={() => (showEditTip = true)}
    >
        <!-- <Tooltip text={'Editer'} position="top" show={showEditTip} /> -->
        <RoundedButton
            size={8}
            on:click={handleEdit}
            iconPath="icons/button/edit.svg"
        />
    </div>
</div>

<style>
    #automation {
        background-color: #22164d;
    }
</style>
