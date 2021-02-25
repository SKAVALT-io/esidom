<script>
    import { onDestroy, SvelteComponent } from 'svelte';
    import type { BinarySensorEntity } from '../../../../types/entities/binarySensorEntity';

    import { socketManager } from '../../../managers/socketManager';
    import { getEntity } from '../../../services/entityService';
    import ContactSensor from './things/ContactSensor.svelte';

    export let entityId: string;
    let entity: BinarySensorEntity;

    async function loadEntity() {
        entity = await getEntity<BinarySensorEntity>(entityId);
        console.log('binary sensor: ', entity);
    }

    const sensorPropMap = new Map<string, typeof SvelteComponent>();
    sensorPropMap.set('contact', ContactSensor);

    function updateEntity(data: BinarySensorEntity) {
        console.log('new ws', data);
        entity = data;
    }

    socketManager.registerListenerById('entityUpdated', entityId, updateEntity);

    onDestroy(() => {
        socketManager.removeListener('entityUpdated', updateEntity);
    });
</script>

{#await loadEntity()}
    Loading data...
{:then l}
    <div>
        <h1>{entity.name}</h1>

        <div
            id="info"
            class="left-1/4 relative w-1/2 grid grid-cols-12 gap-4 p-4 uppercase"
        >
            <div class="col-span-full text-center">Informations</div>

            <div class="col-span-6 row-start-2 text-center">Nothing</div>
            <div class="col-span-3 row-start-3">Nom:</div>
            <div class="col-span-3 row-start-3">{entity.name}</div>
            <div class="col-span-3 row-start-4">Type:</div>
            <div class="col-span-3 row-start-4">{entity.type}</div>
            <div class="col-span-3 row-start-5">Etat:</div>
            <div class="col-span-3 row-start-5">{entity.state}</div>
        </div>

        <div id="attributes" class=" grid grid-cols-1 gap-4 p-4 m-4">
            {#each Object.entries(entity.attributes) as [key, value] (key)}
                {#if sensorPropMap.has(key)}
                    <div class="text-center">
                        <!-- {key}:{value} -->
                        <svelte:component
                            this={sensorPropMap.get(key)}
                            {...{ value }}
                        />
                    </div>
                {/if}
            {/each}
        </div>
    </div>
{:catch error}
    Error:
    {error}
{/await}

<style lang="scss">
    #info {
        border: 1px solid yellow;
        div:not(:first-child) {
            border: 1px solid yellow;
        }
    }
</style>
