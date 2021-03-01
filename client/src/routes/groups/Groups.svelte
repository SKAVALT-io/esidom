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
    import Tooltip from '../../components/UI/utils/Tooltip.svelte';
    import EntityService from '../../services/entityService';
    import type { Entity } from '../../../types/entityType';
    import toastService from '../../utils/toast';

    let isOpen = false;
    let currentGroup: Group;
    let isLoaded = false;
    let groups: Group[];
    let searchPattern: string = '';
    let showCreateTip = false;
    let editMode = false;
    let flipSwitch = false;
    let selectedSortOption = 0;
    let entities: Entity<unknown>[];
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
        toastService.toast(tr('groups.groupDeleted'));
        const { id } = data;
        groups = groups.filter((g) => id !== `group.${g.groupId}`);
    }

    function groupCreatedHandler(data: Group) {
        toastService.toast(tr('groups.groupCreated'));
        groups = [...groups, data];
    }

    onMount(async () => {
        groups = await GroupService.getGroups();
        entities = await EntityService.getLightAndSwitchEntity();

        isLoaded = true;
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

<div class=" pb-16">
    <div
        class="pb-12 pt-2 flex justify-between relative right-0 top-0 mt-2 mr-2 ml-2 mx-auto text-white"
    >
        <h1 class="text-2xl">{tr('groups.myGroups')}</h1>
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
    {#if !isLoaded}
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
            {#each (searchPattern === '' ? groups : groups.filter((g) =>
                      g.name.toLowerCase().includes(searchPattern.toLowerCase())
                  )).sort(comparator) as group}
                <GroupComponent
                    {group}
                    openEditMode={() => {
                        currentGroup = group;
                        isOpen = true;
                        editMode = true;
                    }}
                    openViewMode={() => {
                        currentGroup = group;
                        isOpen = true;
                        editMode = false;
                    }}
                />
            {/each}
        </div>
    {/if}
</div>
<Modal bind:isOpen>
    <div slot="content">
        <GroupDetail
            bind:currentGroup
            bind:editMode
            bind:entities
            on:close={closeFunction}
        />
    </div>
</Modal>
<div
    class="fixed bottom-0 right-0 h-16 w-16"
    on:touchstart={() => (showCreateTip = true)}
    on:touchend={() => (showCreateTip = false)}
    on:mouseleave={() => (showCreateTip = false)}
    on:mouseenter={() => (showCreateTip = true)}
>
    <Tooltip
        text={tr('groups.buttons.create')}
        position="left"
        show={showCreateTip}
    />
    <RoundedButton
        on:click={() => {
            isOpen = true;
            editMode = true;
            currentGroup = { groupId: '', state: '', name: '', entities: [], implicit: false };
        }}
        iconPath="icons/button/plus.svg"
    />
</div>
