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
    import toastService from '../../utils/toast';

    export let currentRoom: Room;
    export let closeFunction: () => void;
    $: formInvalid = currentRoom.name === '';
    const dispatch = createEventDispatcher();
</script>

<div>
    <h1
        class=" block w-full text-center text-grey-darkest mb-6 font-bold text-3xl"
    >
        {currentRoom.roomId !== '' ? currentRoom.name : tr('rooms.createRoom')}
    </h1>
    <form class="mb-4" on:submit={() => false}>
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
                on:change={() => console.log(currentRoom)}
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
                                        // formInvalid = currentRoom.name === '' || currentRoom.devices.length === 0;
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
        <div class="flex flex-col mb-4 bg-pa pt-6">
            <SaveButton
                bind:isDisabled={formInvalid}
                on:click={async () => {
                    await (currentRoom.roomId !== '' ? RoomService.updateRoom(currentRoom) : RoomService.createRoom(currentRoom));
                    toastService.toast('room updated !');
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
</style>
