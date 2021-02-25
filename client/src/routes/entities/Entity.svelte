<script lang="ts">
    import type { SvelteComponent } from 'svelte';
    import { pop } from 'svelte-spa-router';
    import BinarySensor from '../../components/entities/binarySensor/BinarySensor.svelte';
    import Light from '../../components/entities/lights/Light.svelte';
    import Sensor from '../../components/entities/sensors/Sensor.svelte';
    import OutlineButton from '../../components/UI/buttons/OutlineButton.svelte';

    export let params: { id: string };
    const { id } = params;
    const domain = id.split('.')[0];

    const mapTypeToComp = new Map<string, typeof SvelteComponent>();
    mapTypeToComp.set('light', Light);
    mapTypeToComp.set('binary_sensor', BinarySensor);
    mapTypeToComp.set('sensor', Sensor);

    function getCompByType(id: string) {
        return mapTypeToComp.get(domain);
    }
</script>

<div class="px-8 pb-20 md:pb-0">
    <OutlineButton text="Retour" on:click={pop} />

    <br />
    {#if mapTypeToComp.has(domain)}
        <svelte:component this={getCompByType(id)} {...{ entityId: id }} />
    {:else}
        <h1>No adapter for this type of entity: {domain}</h1>
    {/if}
</div>
