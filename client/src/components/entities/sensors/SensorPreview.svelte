<script>
    import { onDestroy, onMount } from 'svelte';
    import type { SensorEntity } from '../../../../types/entities/sensorEntity';

    import { socketManager } from '../../../managers/socketManager';

    import EntityPreview from '../EntityPreview.svelte';

    export let entity: SensorEntity;

    // Is it on or off
    let isOn: boolean;
    // The src for the icon
    let srcImg: string;
    $: isOn = entity.state === 'on';
    // $: srcImg = isOn ? 'door-open.png' : 'door-close.png';

    function updateState(data: BinarySensorEntity) {
        console.log('new ws', data);
        entity = data;
    }

    onMount(() => {
        socketManager.registerListener(
            'entity_updated',
            entity.id,
            updateState
        );
    });

    onDestroy(() => {
        socketManager.removeListener('entity_updated', updateState);
    });
</script>

<EntityPreview isError={false} {entity}>
    <!-- Image -->
    <img slot="img" src={srcImg} alt="" />
    <!-- Data -->
    <div slot="sensor">
        Etat:
        {entity.state + (entity.attributes.unit_of_measurement ?? '')}
    </div>
</EntityPreview>
