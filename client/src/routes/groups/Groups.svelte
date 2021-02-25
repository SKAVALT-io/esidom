<script lang="ts">
    import GroupService from '../../services/groupService';
    import GroupComponent from '../../components/groups/GroupComponent.svelte';
    import Modal from '../../components/UI/modal/Modal.svelte';
    import GroupDetail from '../../components/groups/GroupDetail.svelte';
    import type { Group } from '../../../types/groupType';
    import LoadingAnimation from '../../components/animations/LoadingAnimation.svelte';
    import DropdownButton from '../../components/UI/buttons/DropdownButton.svelte';
    import RoundedButton from '../../components/UI/buttons/RoundedButton.svelte';
    import SearchBar from '../../components/UI/bar/SearchBar.svelte';
    import { tr } from '../../utils/i18nHelper';
    import { onMount, onDestroy } from 'svelte';
    import { socketManager } from '../../managers/socketManager';

    let isOpen = false;
    let currentGroup: Group;
    let isLoad = true;
    let groups: Group[];
    let searchPattern: string = '';

    let flipSwitch = false;
    let selectedSortOption = 0;
    const comparators = [
        [
            (a: Group, b: Group) =>
                a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1,
            (a: Group, b: Group) =>
                a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1,
        ],
    ];
    $: comparator = comparators[selectedSortOption][flipSwitch ? 0 : 1];

    function groupDeletedHandler(data: any) {
        console.log(data);
        const { id } = data;
        groups = groups.filter((g) => id !== `group.${g.groupId}`);
    }

    function groupCreatedHandler(data: Group) {
        console.log(data);
        const newGroup = data;
        groups = [...groups, newGroup];
    }

    onMount(async () => {
        groups = await GroupService.getGroup();
        isLoad = false;
        socketManager.registerGlobalListener(
            'groupCreated',
            groupCreatedHandler
        );
        socketManager.registerGlobalListener(
            'groupRemoved',
            groupDeletedHandler
        );
    });

    onDestroy(() => {
        socketManager.removeListener('groupRemoved', groupDeletedHandler);

        socketManager.removeListener('groupCreated', groupCreatedHandler);
    });

    function closeFunction() {
        isOpen = false;
    }
</script>

<div
    class="pt-2 flex justify-between relative right-0 top-0 mt-2 mr-2 ml-2 mx-auto text-white"
>
    <h1 class="text-2xl">{tr('groups.myGroups')}</h1>
    <div>
        <DropdownButton
            dropDownOptions={[tr('groups.sortBy.options.name')]}
            title={tr('groups.sortBy.title')}
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
        id="group"
        class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mr-2 ml-2 mt-2"
    >
        {#each (searchPattern === '' ? groups : groups.filter((g) => g.name && g.name
                          .toLowerCase()
                          .includes(
                              searchPattern.toLowerCase()
                          ))).sort(comparator) as group}
            <GroupComponent
                {group}
                on:click={() => {
                    currentGroup = group;
                    isOpen = true;
                }}
            />
        {/each}
    </div>
{/if}

<Modal bind:isOpen>
    <div slot="content">
        <GroupDetail bind:currentGroup {closeFunction} />
    </div>
</Modal>
<div class="fixed bottom-0 right-0 h-16 w-16">
    <RoundedButton
        on:click={() => {
            isOpen = true;
            currentGroup = { groupId: '', state: '', name: '', entities: [], implicit: false };
        }}
        iconPath="icons/button/plus.svg"
    />
</div>
