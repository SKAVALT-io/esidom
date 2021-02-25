<script>
    import { onDestroy, onMount } from 'svelte';

    import type { LightEntity } from '../../../../types/entities/lightEntity';
    import { socketManager } from '../../../managers/socketManager';
    import {
        switchLamp,
        updateLight,
    } from '../../../services/entities/lightService';

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

    function switchLight() {
        switchLamp(entity.id, !isOn);
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
    <img
        slot="img"
        src={srcLamp}
        alt=""
        on:click={switchLight}
        class="h-inherit max-w-full max-h-full object-contain"
    />
    <!-- Data -->
    <div slot="sensor" class="px-2">
        {#if isOn}
            <BrightnessPicker
                value={entity.attributes.brightness}
                on:valuechange={updateEntity}
            />
        {/if}
    </div>
</EntityPreview>
