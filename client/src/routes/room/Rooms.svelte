<script lang="ts">
    import GroupService from '../../services/groupService';
    import Modal from '../../components/UI/modal/Modal.svelte';
    import type { Room } from '../../../types/roomType';
    import LoadingAnimation from '../../components/animations/LoadingAnimation.svelte';
    import DropdownButton from '../../components/UI/buttons/DropdownButton.svelte';
    import RoundedButton from '../../components/UI/buttons/RoundedButton.svelte';
    import SearchBar from '../../components/UI/bar/SearchBar.svelte';
    import { tr } from '../../utils/i18nHelper';
    import { onMount, onDestroy } from 'svelte';
    import { socketManager } from '../../managers/socketManager';
    import RoomComponent from '../../components/rooms/RoomComponent.svelte';
    import RoomService from '../../services/roomService';
    import RoomDetail from '../../components/rooms/RoomDetail.svelte';
    import toastService from '../../utils/toast';

    let isOpen = false;
    let currentRoom: Room;
    let isLoad = true;
    let rooms: Room[];
    let searchPattern: string = '';

    let flipSwitch = false;
    let selectedSortOption = 0;
    const comparators = [
        [
            (a: Room, b: Room) =>
                a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1,
            (a: Room, b: Room) =>
                a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1,
        ],
    ];
    $: comparator = comparators[selectedSortOption][flipSwitch ? 0 : 1];

    function roomDeletedHandler(data: any) {
        toastService.toast(tr('rooms.roomDeleted'));
        const { id } = data;
        rooms = rooms.filter((r) => id !== `${r.roomId}`);
    }

    function roomCreatedHandler(data: Room) {
        toastService.toast(tr('rooms.roomCreated'));
        const newRoom = data;
        rooms = [...rooms, newRoom];
    }

    onMount(async () => {
        rooms = await RoomService.getRooms();
        isLoad = false;

        socketManager.registerGlobalListener('roomCreated', roomCreatedHandler);
        socketManager.registerGlobalListener('roomRemoved', roomDeletedHandler);
    });

    onDestroy(() => {
        socketManager.removeListener('roomRemoved', roomDeletedHandler);
        socketManager.removeListener('roomCreated', roomCreatedHandler);
    });

    function closeFunction() {
        isOpen = false;
    }
</script>

<div
    class="pt-2 flex justify-between relative right-0 top-0 mt-2 mr-2 ml-2 mx-auto text-white"
>
    <h1 class="text-2xl">{tr('rooms.myRooms')}</h1>
    <div>
        <DropdownButton
            dropDownOptions={[tr('sortBy.options.name')]}
            title={tr('sortBy.title')}
            arrowUp={flipSwitch}
            on:click={(e) => {
                if (e.detail === selectedSortOption) {
                    flipSwitch = !flipSwitch;
                }
                selectedSortOption = e.detail;
            }}
        />
        <SearchBar
            debounce={300}
            on:type={(e) => {
                searchPattern = e.detail;
            }}
            on:clear={(e) => {
                searchPattern = '';
            }}
        />
    </div>
</div>
{#if isLoad}
    <div
        class="fixed top-0 left-0 w-full h-screen flex justify-center items-center"
    >
        <LoadingAnimation />
    </div>
{:else}
    <div
        class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mr-2 ml-2 mt-2"
    >
        {#each (searchPattern === '' ? rooms : rooms.filter((r) =>
                  r.name.toLowerCase().includes(searchPattern.toLowerCase())
              )).sort(comparator) as room}
            <RoomComponent
                {room}
                on:click={() => {
                    currentRoom = room;
                    isOpen = true;
                }}
            />
        {/each}
    </div>
{/if}

<Modal bind:isOpen>
    <div slot="content">
        <RoomDetail bind:currentRoom {closeFunction} />
    </div>
</Modal>
<div class="fixed bottom-0 right-0 h-16 w-16">
    <RoundedButton
        on:click={() => {
            isOpen = true;
            currentRoom = { roomId: '', devices: [], automations: [], name: '' };
        }}
        iconPath="icons/button/plus.svg"
    />
</div>
