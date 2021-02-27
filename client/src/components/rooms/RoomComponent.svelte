<script lang="ts">
    import { onDestroy, onMount } from 'svelte';

    import RoundedButton from '../UI/buttons/RoundedButton.svelte';
    import { tr } from '../../utils/i18nHelper';
    import { socketManager } from '../../managers/socketManager';
    import type { Room } from '../../../types/roomType';
    import RoomService from '../../services/roomService';

    export let room: Room;

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

<div
    id="room"
    class="rounded-lg items-center text-center grid grid-cols-10 px-1 py-4"
>
    <div class="flex justify-center items-center col-span-8">{room.name}</div>
    <div class="col-span-1 relative">
        <RoundedButton size={8} on:click iconPath="icons/button/edit.svg" />
    </div>
    <div class="col-span-1 relative">
        <RoundedButton
            size={8}
            on:click={() => {
                RoomService.deleteRoom(room);
            }}
            iconPath="icons/button/trash.svg"
        />
    </div>
</div>

<style>
    #room {
        background-color: #22164d;
    }
</style>
