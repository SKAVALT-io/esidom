<script>
    import { onDestroy, onMount } from 'svelte';

    import type { BinarySensorEntity } from '../../../../types/entities/binarySensorEntity';
    import { socketManager } from '../../../managers/socketManager';

    import EntityPreview from '../EntityPreview.svelte';

    export let entity: BinarySensorEntity;

    // Is it on or off
    let isOn: boolean;
    // The src for the icon
    let srcImg: string;
    $: isOn = entity.state === 'on';
    $: srcImg = isOn ? 'door-open.png' : 'door-close.png';

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
    <img slot="img" src={srcImg} alt="" />
    <!-- Data -->
    <div slot="sensor">Etat: {isOn ? 'ouvert' : 'fermé'}</div>
</EntityPreview>
