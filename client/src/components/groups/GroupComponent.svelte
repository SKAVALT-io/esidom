<script lang="ts">
    import { push } from "svelte-spa-router";
    import { onDestroy, onMount } from "svelte";

    import RoundedButton from "../UI/buttons/RoundedButton.svelte";
    import ToggleButton from "../UI/buttons/ToggleButton.svelte";
    import type { Group } from "../../../types/groupType";
    import Modal from "../UI/modal/Modal.svelte";

    export let group: Group;

    $: checked = true;

    function handleToggle() {
        checked = !checked;
    }

    onMount(async () => {});

    onDestroy(() => {});
</script>

<div
    id="group"
    class="rounded items-center text-center grid grid-cols-10 px-1 py-4"
>
    <div class="col-span-1">
        <ToggleButton on:change={handleToggle} bind:checked />
    </div>
    <div class="flex justify-center items-center col-span-8">{group.name}</div>
    {#if !group.groupId.startsWith('imp')}
        <div class="col-span-1 relative">
            <RoundedButton size={8} on:click iconPath="icons/button/edit.svg" />
        </div>
    {/if}
</div>

<style>
    #group {
        background-color: #22164d;
    }
</style>
