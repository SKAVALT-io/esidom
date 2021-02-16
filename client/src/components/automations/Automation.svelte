<script lang="ts">
    import { push } from 'svelte-spa-router';
    import { onDestroy, onMount } from 'svelte';
    import type { AutomationPreview } from '../../../types/automationType';
    import AutomationService from '../../services/automationService';
    import RoundedButton from '../UI/buttons/RoundedButton.svelte';
    import ToggleButton from '../UI/buttons/ToggleButton.svelte';
    import { socketManager } from '../../managers/socketManager';

    export let automation: AutomationPreview;

    $: checked = automation.state === 'on';

    function handleToggle() {
        checked = !checked;
        AutomationService.toggleAutomation(
            automation.id,
            checked ? 'on' : 'off'
        );
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
    class="rounded items-center text-center grid grid-cols-10 px-1 py-4"
>
    <div class="col-span-1">
        <ToggleButton on:change={handleToggle} bind:checked />
    </div>
    <div class="flex justify-center items-center col-span-8">
        {automation.name}
    </div>
    <div class="col-span-1 relative">
        <RoundedButton
            size={8}
            on:click={() /*TODO: go to edit page*/ => push('/home')}
            iconPath="icons/edit.svg"
        />
    </div>
</div>

<style>
    #automation {
        background-color: #22164d;
    }
</style>
