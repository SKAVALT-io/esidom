<script>
    import { onDestroy, onMount } from 'svelte';

    import type { BinarySensorEntity } from '../../../../types/entities/binarySensorEntity';
    import { socketManager } from '../../../managers/socketManager';
    import { tr } from '../../../utils/i18nHelper';
    import EntityPreview from '../EntityPreview.svelte';

    export let entity: BinarySensorEntity;

    // Is it on or off
    let isOn: boolean;
    // The src for the icon
    let srcImg: string;
    $: isOn = entity.state === 'on';
    $: srcImg = isOn ? 'devices/door-open.png' : 'devices/door-closed.png';

    function updateState(data: BinarySensorEntity) {
        console.log('new ws', data);
        entity = data;
    }

    onMount(() => {
        socketManager.registerListenerById(
            'entityUpdated',
            entity.id,
            updateState
        );
    });

    onDestroy(() => {
        socketManager.removeListener('entityUpdated', updateState);
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
        {isOn ? tr('entities.binarySensor.on') : tr('entities.binarySensor.off')}
    </div>
</EntityPreview>
