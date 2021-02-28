<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type { AutomationPreview } from '../../../types/automationType';
    import { tr } from '../../utils/i18nHelper';

    import Automation from '../../components/automations/Automation.svelte';
    import SearchBar from '../../components/UI/bar/SearchBar.svelte';
    import AutomationService from '../../services/automationService';
    import DropdownButton from '../../components/UI/buttons/DropdownButton.svelte';
    import RoundedButton from '../../components/UI/buttons/RoundedButton.svelte';
    import { push } from 'svelte-spa-router';
    import LoadingAnimation from '../../components/animations/LoadingAnimation.svelte';
    import { socketManager } from '../../managers/socketManager';
    import Tooltip from '../../components/UI/utils/Tooltip.svelte';

    let showCreateTip = false;
    let automations: AutomationPreview[] = [];
    let searchValue = '';
    $: filteredAutomations = filterAutomations(searchValue);
    $: isFiltered = searchValue !== '';

    let flipSwitch = false;
    let selectedSortOption = 0;
    const comparators = [
        [
            (a: AutomationPreview, b: AutomationPreview) =>
                a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1,
            (a: AutomationPreview, b: AutomationPreview) =>
                a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1,
        ],
        [
            (a: AutomationPreview, b: AutomationPreview) =>
                a.state > b.state ? -1 : 1,
            (a: AutomationPreview, b: AutomationPreview) =>
                a.state < b.state ? -1 : 1,
        ],
    ];
    $: comparator = comparators[selectedSortOption][flipSwitch ? 0 : 1];

    function filterAutomations(searchInput: string): AutomationPreview[] {
        return automations.filter((aut: AutomationPreview) =>
            aut.name.toLowerCase().includes(searchInput)
        );
    }

    async function getAutomations() {
        automations = await AutomationService.getAutomations();
    }

    function automationDeletedHandler(data: { id: string }) {
        const { id: automationId } = data;
        console.log(`automation ${automationId} deleted`);
        automations = automations.filter(
            (a: AutomationPreview) => a.id !== automationId
        );
        filterAutomations('');
    }

    function automationCreatedHandler(data: AutomationPreview) {
        const index = automations.findIndex((a) => a.id === data.id);
        if (index === -1) {
            automations = [...automations, data];
        } else {
            automations = [
                ...automations.filter((a) => a.id !== data.id),
                data,
            ];
        }
        console.log(`automation ${data.id} created`);
        filterAutomations('');
    }

    onMount(() => {
        socketManager.registerGlobalListener(
            'automationRemoved',
            automationDeletedHandler
        );
        socketManager.registerGlobalListener(
            'automationCreated',
            automationCreatedHandler
        );
    });

    onDestroy(() => {
        socketManager.removeListener(
            'automationRemoved',
            automationDeletedHandler
        );
        socketManager.removeListener(
            'automationCreated',
            automationCreatedHandler
        );
    });
</script>

<div
    class="pb-12 pt-2 flex justify-between relative right-0 top-0 mt-2 mr-2 ml-2 mx-auto text-white"
>
    <h1 class="text-2xl">{tr('automations.myAutomations')}</h1>
    <div
        class="fixed bottom-0 z-10 right-0 h-16 w-16"
        on:touchstart={() => (showCreateTip = true)}
        on:touchend={() => (showCreateTip = false)}
        on:mouseleave={() => (showCreateTip = false)}
        on:mouseenter={() => (showCreateTip = true)}
    >
        <Tooltip
            text={tr('automations.buttons.create')}
            position="left"
            show={showCreateTip}
        />
        <RoundedButton
            on:click={() => {
                push('/blockly');
            }}
            iconPath="icons/button/plus.svg"
        />
    </div>
    <div>
        <DropdownButton
            dropDownOptions={[tr('automations.sortBy.options.name'), tr('automations.sortBy.options.state')]}
            title={tr('automations.sortBy.title')}
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
                searchValue = e.detail;
                filterAutomations(searchValue);
            }}
            on:clear={(e) => (searchValue = '')}
        />
    </div>
</div>

{#await getAutomations()}
    <div id="loader" class="flex h-4/6 items-center justify-center">
        <LoadingAnimation />
    </div>
{:then}
    <div
        id="automation"
        class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mr-2 ml-2 mt-2"
    >
        {#each [...(isFiltered ? filteredAutomations : automations)].sort(comparator) as automation}
            <Automation {automation} />
        {/each}
    </div>
{:catch err}
    <p class="text-red-800">{err.message}</p>
{/await}
