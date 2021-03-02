<script lang="ts">
    import { onDestroy, onMount } from 'svelte';

    import RoundedButton from '../UI/buttons/RoundedButton.svelte';
    import { tr } from '../../utils/i18nHelper';
    import { socketManager } from '../../managers/socketManager';
    import type { Room } from '../../../types/roomType';
    import RoomService from '../../services/roomService';
    import Tooltip from '../UI/utils/Tooltip.svelte';
    import ConfirmationModal from '../UI/modal/ConfirmationModal.svelte';

    export let room: Room;

    export let openEditMode: () => void;
    export let openViewMode: () => void;

    let showDeleteTip = false;
    let showEditTip = false;
    let showViewTip = false;

    let isConfirmDeleteOpen = false;
    async function handleDelete(): Promise<void> {
        isConfirmDeleteOpen = false;
        RoomService.deleteRoom(room).catch(console.log);
    }

    function roomUpdatedHandler(data: Room) {
        if (data.roomId === room.roomId) {
            room = data;
        }
    }

    onMount(async () => {
        socketManager.registerGlobalListener('roomUpdated', roomUpdatedHandler);
    });

    onDestroy(() => {
        socketManager.removeListener('roomUpdated', roomUpdatedHandler);
    });
</script>

<!-- Delete confirmation modal -->
<ConfirmationModal
    bind:isOpen={isConfirmDeleteOpen}
    on:confirm={handleDelete}
    text={tr('rooms.confirmDelete')}
/>

<div
    id="room"
    class="rounded-lg border border-gray-400 hover:border-white items-center text-center grid grid-cols-10 px-1 py-4"
>
    <div class="flex justify-center items-center col-span-7">{room.name}</div>
    <div
        class="col-span-1 relative"
        on:touchstart={() => (showViewTip = true)}
        on:touchend={() => (showViewTip = false)}
        on:mouseleave={() => (showViewTip = false)}
        on:mouseenter={() => (showViewTip = true)}
    >
        <Tooltip
            text={tr('rooms.buttons.view')}
            position="top"
            show={showViewTip}
        />
        <RoundedButton
            size={8}
            on:click={openViewMode}
            iconPath="icons/button/visibility.svg"
        />
    </div>
    <div class="col-span-1 relative">
        <div
            class="col-span-1 relative"
            on:touchstart={() => (showEditTip = true)}
            on:touchend={() => (showEditTip = false)}
            on:mouseleave={() => (showEditTip = false)}
            on:mouseenter={() => (showEditTip = true)}
        >
            <Tooltip
                text={tr('rooms.buttons.edit')}
                position="top"
                show={showEditTip}
            />
            <RoundedButton
                size={8}
                on:click={openEditMode}
                iconPath="icons/button/edit.svg"
            />
        </div>
    </div>
    <div
        class="col-span-1 relative"
        on:touchstart={() => (showDeleteTip = true)}
        on:touchend={() => (showDeleteTip = false)}
        on:mouseleave={() => (showDeleteTip = false)}
        on:mouseenter={() => (showDeleteTip = true)}
    >
        <Tooltip
            text={tr('rooms.buttons.delete')}
            position="top"
            show={showDeleteTip}
        />
        <RoundedButton
            size={8}
            on:click={() => (isConfirmDeleteOpen = true)}
            iconPath="icons/button/trash.svg"
        />
    </div>
</div>

<style>
    #room {
        background-color: #22164d;
    }
</style>
