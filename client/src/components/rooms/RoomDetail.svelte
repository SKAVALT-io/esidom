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
    import InputBar from '../UI/bar/InputBar.svelte';
    import type { Device } from '../../../types/deviceType';
    import ReturnButton from '../UI/buttons/ReturnButton.svelte';

    export let currentRoom: Room;
    export let devices: Device[];
    export let editMode: boolean;
    $: formInvalid = currentRoom.name === '';
    const dispatch = createEventDispatcher();

    function save() {
        currentRoom.roomId !== ''
            ? RoomService.updateRoom(currentRoom)
            : RoomService.createRoom(currentRoom);
        dispatch('close');
    }

    function handleCheckbox(val: any, device: Device) {
        if (val.target.checked) {
            currentRoom.devices.push(device);
        } else {
            currentRoom.devices = currentRoom.devices.filter(
                (e) => e.id !== device.id
            );
        }
    }
</script>

<div>
    <h1
        class=" block w-full text-center text-grey-darkest mb-6 font-bold text-3xl"
    >
        {currentRoom.roomId !== '' ? currentRoom.name : tr('rooms.createRoom')}
    </h1>
    {#if editMode}
        <form class="mb-4" on:submit={() => false}>
            <div class="flex flex-col mb-4">
                <InputBar
                    label={tr('rooms.roomName')}
                    bind:input={currentRoom.name}
                    placeholder={tr('rooms.roomName')}
                    required={true}
                    width="56"
                />
            </div>
            <div class="block">
                <label
                    class="mb-2 font-bold text-lg text-grey-darkest"
                    for="Name"
                >{tr('rooms.roomDevices')}</label>

                <div class="mt-2">
                    {#each devices as device}
                        <div>
                            <label class="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    class="form-checkbox"
                                    checked={currentRoom.devices.find((e) => {
                                        return e.id === device.id;
                                    })}
                                    on:click={(val) => handleCheckbox(val, device)}
                                />
                                <span
                                    class="ml-2"
                                >{device.name ? device.name : device.id}</span>
                            </label>
                        </div>
                    {/each}
                </div>
            </div>
            <div class="flex flex-col mb-4 bg-pa pt-6">
                <SaveButton bind:isDisabled={formInvalid} on:click={save} />
            </div>
        </form>
    {:else}
        <div class="mb-4">
            <label
                class="mb-2 font-bold text-lg text-grey-darkest"
                for="Name"
            >{tr('groups.groupEntities')}</label>
            <ul class="pt-4">
                {#each currentRoom.devices as device}
                    <li class="border list-none rounded-sm px-3 py-3">
                        {device.name}
                    </li>
                {/each}
            </ul>

            <div class="flex flex-col mb-4 pt-6">
                <ReturnButton
                    on:click={() => {
                        dispatch('close');
                    }}
                />
            </div>
        </div>
    {/if}
</div>

<style>
    input {
        background-color: #453b69;
    }
</style>
