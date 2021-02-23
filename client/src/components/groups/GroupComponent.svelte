<script lang="ts">
    import { push } from "svelte-spa-router";
    import { onDestroy, onMount } from "svelte";

    import RoundedButton from "../UI/buttons/RoundedButton.svelte";
    import ToggleButton from "../UI/buttons/ToggleButton.svelte";
    import type { Group } from "../../../types/groupType";
    import Modal from "../UI/modal/Modal.svelte";
    import GroupService from "../../services/groupService";
    import { tr } from "../../utils/i18nHelper";
    import { socketManager } from "../../managers/socketManager";
    import EntityService from "../../services/entityService";

    export let group: Group;
    let checked = group.state === "on";

    function handleToggle() {
        checked = !checked;
    }
    function groupUpdatedHandler(data: any) {
        checked = data?.state === "on";
    }

    onMount(async () => {
        if (!group.groupId) {
            return;
        }
        socketManager.registerListener(
            "entity_updated",
            `group.${group.groupId}`,
            groupUpdatedHandler
        );
    });

    onDestroy(() => {
        socketManager.removeListener("entity_updated", groupUpdatedHandler);
    });
</script>

<div
    id="group"
    class="rounded items-center text-center grid grid-cols-10 px-1 py-4"
>
    <div class="col-span-1">
        <ToggleButton on:change={handleToggle} bind:checked />
    </div>
    <div class="flex justify-center items-center col-span-7">
        {#if group.implicit}
            [{tr('groups.implicitGroup.name')}]
            {tr(`groups.implicitGroup.cat.${group.type}`)}
            {#if group.room}
                {tr('groups.implicitGroup.of') + group.room.name}
            {/if}
        {:else}{group.name}{/if}
    </div>
    {#if !group.implicit}
        <div class="col-span-1 relative">
            <RoundedButton size={8} on:click iconPath="icons/button/edit.svg" />
        </div>
        <div class="col-span-1 relative">
            <RoundedButton
                size={8}
                on:click={() => {
                    GroupService.deleteGroup(group);
                }}
                iconPath="icons/button/trash.svg"
            />
        </div>
    {/if}
</div>

<style>
    #group {
        background-color: #22164d;
    }
</style>
