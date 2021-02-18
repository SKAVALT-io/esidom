<script lang="ts">
    import { onMount } from 'svelte';
    import type { AutomationPreview } from '../../../types/automationType';
    import { tr } from '../../utils/i18nHelper';

    import Automation from '../../components/automations/Automation.svelte';
    import SearchBar from '../../components/others/SearchBar.svelte';
    import AutomationService from '../../services/automationService';
    import DropdownButton from '../../components/UI/buttons/DropdownButton.svelte';

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

    onMount(async () => {
        automations = await AutomationService.getAutomations();
    });

    function filterAutomations(searchInput: string): AutomationPreview[] {
        return automations.filter((aut: AutomationPreview) =>
            aut.name.toLowerCase().includes(searchInput)
        );
    }
</script>

<div
    class="pt-2 flex justify-between relative right-0 top-0 mt-2 mr-2 ml-2 mx-auto text-white"
>
    <h1 class="text-2xl">{tr('automations.myAutomations')}</h1>

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
<div
    id="automation"
    class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mr-2 ml-2 mt-2"
>
    {#each [...(isFiltered ? filteredAutomations : automations)].sort(comparator) as automation}
        <Automation {automation} />
    {/each}
</div>
