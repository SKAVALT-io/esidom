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
    import type { Entity } from "../../../types/entityType";
    import {
        toggle
    } from '../../services/entities/generalService';

    export let group: Group;
    let checked = group.state === "on";

    function handleToggle() {
        console.log(group.groupId);
        if (!group.groupId){
            return;
        }
        toggle(`group.${group.groupId}`);
    }
    
    function groupEntityUpdatedHandler(data: any) {
        checked = data?.state === "on";
    }
    function groupUpdatedHandler(data: any) {
        if (data.groupId && data.groupId === group.groupId){
            group = data;
            group = GroupService.updateGroupNameIfIsImplicit(group);  
        }
    }

    onMount(async () => {
        if (!group.groupId) {
            return;
        }
        socketManager.registerListenerById<Entity<any>>(
            "entityUpdated",
            `group.${group.groupId}`,
            groupEntityUpdatedHandler
        );
        socketManager.registerGlobalListener("groupUpdated", groupUpdatedHandler);

    });

    onDestroy(() => {
        socketManager.removeListener("entityUpdated", groupEntityUpdatedHandler);
        socketManager.removeListener("groupUpdated", groupUpdatedHandler);
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
        {group.name}
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
