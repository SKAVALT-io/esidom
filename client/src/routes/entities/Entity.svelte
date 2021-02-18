<script lang="ts">
    import type { SvelteComponent } from 'svelte';
    import { pop } from 'svelte-spa-router';
    import Light from '../../components/entities/lights/Light.svelte';

    export let params: { id: string };
    const { id } = params;
    const domain = id.split('.')[0];

    const mapTypeToComp = new Map<string, typeof SvelteComponent>();
    mapTypeToComp.set('light', Light);

    function getCompByType(id: string) {
        return mapTypeToComp.get(domain);
    }
</script>

<button
    on:click={pop}
    class="border-white border-2 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
>Retour</button>

<br />
{#if mapTypeToComp.has(domain)}
    <svelte:component this={getCompByType(id)} {...{ entityId: id }} />
{:else}
    <h1>No adapter for this type of entity: {domain}</h1>
{/if}

<style>
</style>
