<script lang="ts">
    import Automation from '../../components/automations/Automation.svelte';
    import AutomationService from '../../services/automationService';
</script>

{#await AutomationService.getAutomations()}
    <p>loading</p>
{:then automations}
    <div
        id="automation"
        class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mr-2 ml-2 mt-2"
    >
        {#each automations as automation}
            <Automation {automation} />
        {/each}
    </div>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
