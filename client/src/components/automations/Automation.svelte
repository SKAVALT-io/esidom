<script lang="ts">
    import { push } from 'svelte-spa-router';

    import type { AutomationPreview } from '../../../types/automationType';
    import RoundedButton from '../UI/buttons/RoundedButton.svelte';
    import ToggleButton from '../UI/buttons/ToggleButton.svelte';

    export let automation: AutomationPreview;
    let checked = automation.state === 'on';

    function handleChange(event: { target: HTMLInputElement }) {
        // TODO: make HTTP request
    }
</script>

<div
    id="automation"
    class="rounded items-center text-center grid grid-cols-10 px-1 py-4"
>
    <div class="col-span-1">
        <ToggleButton bind:checked />
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
