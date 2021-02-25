<script lang="ts">
    import { onDestroy, onMount } from 'svelte';

    import RoundedButton from '../UI/buttons/RoundedButton.svelte';
    import ToggleButton from '../UI/buttons/ToggleButton.svelte';
    import type { Group } from '../../../types/groupType';
    import GroupService from '../../services/groupService';
    import { socketManager } from '../../managers/socketManager';
    import EntityService from '../../services/entityService';

    export let group: Group;
    let checked = group.state === 'on';

    function handleToggle() {
        console.log(group.groupId);
        if (!group.groupId) {
            return;
        }
        EntityService.toggle(`group.${group.groupId}`);
    }
    function groupUpdatedHandler(data: Group) {
        if (data.groupId && data.groupId === group.groupId) {
            group = data;
            checked = data?.state === 'on';
            group = GroupService.updateGroupNameIfIsImplicit(group);
        }
    }

    onMount(async () => {
        if (!group.groupId) {
            return;
        }
        socketManager.registerGlobalListener(
            'groupUpdated',
            groupUpdatedHandler
        );
    });

    onDestroy(() => {
        socketManager.removeListener('groupUpdated', groupUpdatedHandler);
    });
</script>

<div
    id="group"
    class="rounded-lg items-center text-center grid px-1 py-4"
    class:grid-cols-10={!group.implicit}
    class:grid-cols-8={group.implicit}
>
    <div class="col-span-1">
        <ToggleButton on:change={handleToggle} bind:checked />
    </div>
    <div class="flex justify-center items-center col-span-7">{group.name}</div>
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
