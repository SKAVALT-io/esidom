<script>
    import { onDestroy, SvelteComponent } from 'svelte';
    import type { SensorEntity } from '../../../../types/entities/sensorEntity';
    import { socketManager } from '../../../managers/socketManager';
    import { getEntity } from '../../../services/entityService';
    import { tr } from '../../../utils/i18nHelper';

    export let entityId: string;
    let entity: SensorEntity;

    async function loadEntity() {
        entity = await getEntity<SensorEntity>(entityId);
        console.log('binary sensor: ', entity);
    }

    function updateEntity(data: SensorEntity) {
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
        <div id="title">
            <h1 class="text-4xl text-center py-6">{entity.name}</h1>
        </div>

        <div id="content" class="flex flex-row justify-center">
            <div
                id="info"
                class="relative grid grid-cols-12 gap-4 py-4 uppercase bg-esidomlight w-full justify-center md:w-2/3 md:max-w-xl"
            >
                <div class="col-span-full text-center font-semibold text-xl">
                    {tr('entities.menu.informations')}
                </div>

                <div class="col-span-3 row-start-2 text-right">
                    {tr('entities.menu.name')}
                </div>
                <div class="col-span-9 row-start-2">{entity.name}</div>
                <div class="col-span-3 row-start-3 text-right">
                    {tr('entities.menu.type')}
                </div>
                <div class="col-span-9 row-start-3">{entity.type}</div>
                <div class="col-span-3 row-start-4 text-right">
                    {tr('entities.menu.state')}
                </div>
                <div class="col-span-9 row-start-4">
                    {entity.state + (entity.attributes.unit_of_measurement ?? '')}
                </div>
            </div>
        </div>
    </div>
{:catch error}
    Error:
    {error}
{/await}
