<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';

    import RoundedButton from '../UI/buttons/RoundedButton.svelte';
    import ToggleButton from '../UI/buttons/ToggleButton.svelte';
    import type { Room } from '../../../types/roomType';
    import Modal from '../UI/modal/Modal.svelte';
    import SaveButton from '../UI/buttons/SaveButton.svelte';
    import { each } from 'svelte/internal';

    import LoadingAnimation from '../animations/LoadingAnimation.svelte';

    import { tr } from '../../utils/i18nHelper';
    import DeviceService from '../../services/deviceService';
    import RoomService from '../../services/roomService';

    export let currentRoom: Room;
    export let closeFunction: () => void;
    const dispatch = createEventDispatcher();
</script>

<div>
    <h1
        class=" block w-full text-center text-grey-darkest mb-6 font-bold text-3xl"
    >
        {currentRoom.roomId !== '' ? currentRoom.name : tr('rooms.createRoom')}
    </h1>
    <form class="mb-4">
        <div class="flex flex-col mb-4">
            <label
                class="mb-2 font-bold text-lg text-grey-darkest"
                for="Name"
            >{tr('rooms.roomName')}</label>
            <input
                required
                type="text"
                name="Name"
                id="Name"
                bind:value={currentRoom.name}
                class="border py-2 px-3 text-grey-darkest"
                placeholder={tr('rooms.roomName')}
            />
        </div>
        <div class="block">
            <label
                class="mb-2 font-bold text-lg text-grey-darkest"
                for="Name"
            >{tr('rooms.roomDevices')}</label>

            <div class="mt-2">
                {#await DeviceService.getDevices()}
                    <div class="loader">
                        <LoadingAnimation />
                    </div>
                {:then devices}
                    {#each devices as device}
                        <div>
                            <label class="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    class="form-checkbox"
                                    checked={currentRoom.devices.find((e) => {
                                        return e.id === device.id;
                                    })}
                                    on:click={(val) => {
                                        if (val.target.checked) {
                                            currentRoom.devices.push(device);
                                        } else {
                                            currentRoom.devices = currentRoom.devices.filter((e) => e.id !== device.id);
                                        }
                                    }}
                                />
                                <span
                                    class="ml-2"
                                >{device.name ? device.name : device.id}</span>
                            </label>
                        </div>
                    {/each}
                {/await}
            </div>
        </div>
        <div class="flex flex-col mb-4">
            <SaveButton
                on:click={() => {
                    currentRoom.roomId !== '' ? RoomService.updateRoom(currentRoom) : RoomService.createRoom(currentRoom);
                    closeFunction?.();
                }}
            />
        </div>
    </form>
</div>

<style>
    input {
        background-color: #453b69;
    }

    .container {
        grid-template-columns: 100px 50px 100px;
        grid-template-rows: 80px auto 80px;
        column-gap: 10px;
        row-gap: 15px;
    }
</style>
