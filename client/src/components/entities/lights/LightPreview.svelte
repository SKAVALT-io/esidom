<script>
    import { onDestroy, onMount } from 'svelte';

    import type { LightEntity } from '../../../../types/entities/lightEntity';
    import { socketManager } from '../../../managers/socketManager';
    import {
        switchLamp,
        updateLight,
    } from '../../../services/entities/lightService';
    import { hexToRgb, rgbToHex } from '../../../utils/functions';

    import EntityPreview from '../EntityPreview.svelte';
    import ColoredLightOn from './ColoredLightOn.svelte';
    import BrightnessPicker from './things/BrightnessPicker.svelte';

    export let entity: LightEntity;

    // Is it on or off
    let isOn: boolean;
    $: isOn = entity.state === 'on';

    function updateLightState(data: LightEntity) {
        console.log('new ws', data);
        entity = data;
    }

    function updateEntity(event: CustomEvent<{ [id: string]: any }>) {
        console.log('UPDATE: ', event.detail);
        updateLight(entity.id, event.detail);
    }

    function updateColor(serviceData: { [id: string]: unknown }) {
        updateLight(entity.id, serviceData);
    }

    function switchLight() {
        if (isOn) {
            entity.state = 'off';
            entity.attributes.rgb_color = undefined;
        }
        switchLamp(entity.id, !isOn);
    }

    onMount(() => {
        socketManager.registerListenerById(
            'entityUpdated',
            entity.id,
            updateLightState
        );
    });

    onDestroy(() => {
        socketManager.removeListener('entityUpdated', updateLightState);
    });

    let [r, g, b] = [0, 0, 0];
    $: [r, g, b] = entity.attributes.rgb_color ?? [0, 0, 0];
    let HEXA = '';
    $: HEXA = entity.attributes.rgb_color ? rgbToHex(r, g, b) : '';

    const colorCallback = (e: any) => {
        const hex = e.target.value;
        const [r, g, b] = hexToRgb(hex);
        updateColor({
            rgb_color: [r, g, b],
        });
    };

    let fillColor = 'fff';
    $: fillColor = HEXA === '' ? (isOn ? '#FFFF00' : '#FFF') : HEXA;
    let brightnessPct: number;
    $: brightnessPct = +(
        ((entity.attributes.brightness ?? 255) / 255) *
        100
    ).toFixed(0);
</script>

<EntityPreview isError={false} {entity}>
    <!-- Image -->

    <div slot="img">
        {#if isOn}
            <ColoredLightOn
                {brightnessPct}
                on:click={switchLight}
                {fillColor}
            />
        {:else}
            <img
                on:click={switchLight}
                class="cursor-pointer h-inherit max-w-full max-h-full object-contain"
                src="icons/button/lightOff.svg"
                alt=""
            />
        {/if}
    </div>

    <!-- Data -->
    <div slot="sensor" class="px-2">
        {#if isOn}
            <BrightnessPicker
                value={entity.attributes.brightness}
                on:valuechange={updateEntity}
            />
            {#if entity.attributes.rgb_color !== undefined}
                <input
                    type="color"
                    name=""
                    id=""
                    class="w-full"
                    value={HEXA}
                    on:change={colorCallback}
                />
            {/if}
        {/if}
    </div>
</EntityPreview>
