<script>
    import { onDestroy, onMount } from 'svelte';

    import type { LightEntity } from '../../../../types/entities/lightEntity';
    import { socketManager } from '../../../managers/socketManager';
    import { updateLight } from '../../../services/entities/lightService';

    import EntityPreview from '../EntityPreview.svelte';
    import BrightnessPicker from './things/BrightnessPicker.svelte';

    export let entity: LightEntity;

    // Is it on or off
    let isOn: boolean;
    // The src for the icon
    let srcLamp: string;
    $: isOn = entity.state === 'on';
    $: srcLamp = isOn ? 'lampe-allumee.png' : 'lampe-eteinte.png';

    function updateLightState(data: LightEntity) {
        console.log('new ws', data);
        entity = data;
    }

    function updateEntity(event: CustomEvent<{ [id: string]: string }>) {
        console.log('UPDATE: ', event.detail);
        updateLight(entity.id, event.detail);
    }

    onMount(() => {
        socketManager.registerListener(
            'entity_updated',
            entity.id,
            updateLightState
        );
    });

    onDestroy(() => {
        socketManager.removeListener('entity_updated', updateLightState);
    });
</script>

<EntityPreview isError={false} {entity}>
    <!-- Image -->
    <img slot="img" src={srcLamp} alt="" on:click={console.log} />
    <!-- Name -->
    <div slot="name">
        <h2 class="">{entity.name} est {isOn ? 'allumé' : 'éteinte'}</h2>
    </div>
    <!-- Data -->
    <div slot="sensor">
        {#if isOn}
            <BrightnessPicker
                value={entity.attributes.brightness}
                on:valuechange={updateEntity}
            />
        {/if}
    </div>
</EntityPreview>
