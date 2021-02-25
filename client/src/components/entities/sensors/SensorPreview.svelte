<script>
    import { onDestroy, onMount } from 'svelte';
    import type { SensorEntity } from '../../../../types/entities/sensorEntity';

    import { socketManager } from '../../../managers/socketManager';
    import { tr } from '../../../utils/i18nHelper';

    import EntityPreview from '../EntityPreview.svelte';

    export let entity: SensorEntity;

    // Is it on or off
    let isOn: boolean;
    // The src for the icon
    let srcImg = 'sensor.png';
    $: isOn = entity.state === 'on';
    // $: srcImg = isOn ? 'door-open.png' : 'door-close.png';

    function updateState(data: SensorEntity) {
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
    <img
        slot="img"
        src={srcImg}
        alt=""
        class="h-inherit max-w-full max-h-full object-contain"
    />
    <!-- Data -->
    <div slot="sensor">
        {tr('devices.state')}
        :
        {entity.state + (entity.attributes.unit_of_measurement ?? '')}
    </div>
</EntityPreview>
