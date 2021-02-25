<script>
    import { onDestroy, SvelteComponent } from 'svelte';
    import { onMount } from 'svelte';

    import {
        switchLamp,
        updateLight,
    } from '../../../services/entities/lightService';

    import RgbColorPicker from './things/RgbColorPicker.svelte';
    import BrightnessPicker from './things/BrightnessPicker.svelte';
    import ColorTemperaturePicker from './things/ColorTemperaturePicker.svelte';
    import { socketManager } from '../../../managers/socketManager';
    import type { LightEntity } from '../../../../types/entities/lightEntity';
    import { getEntity } from '../../../services/entityService';
    import { tr } from '../../../utils/i18nHelper';

    import ToggleButton from '../../UI/buttons/ToggleButton.svelte';

    export let entityId: string;

    let light: LightEntity;
    let isOn = false;
    $: isOn = light?.state === 'on';

    async function loadLight() {
        light = await getEntity<LightEntity>(entityId);
        console.log('light', light);
    }

    const lightPropMap = new Map<String, typeof SvelteComponent>();
    lightPropMap.set('rgb_color', RgbColorPicker);
    lightPropMap.set('brightness', BrightnessPicker);
    lightPropMap.set('color_temp', ColorTemperaturePicker);

    onMount(() => {
        socketManager.registerListenerById(
            'entityUpdated',
            entityId,
            updateLightState
        );
    });

    function updateLightState(data: LightEntity) {
        console.log('new ws', data);
        light = data;
    }

    function updateEntity(event: CustomEvent<{ [id: string]: string }>) {
        console.log('UPDATE: ', event.detail);
        updateLight(entityId, event.detail);
    }

    onDestroy(() => {
        socketManager.removeListener('entityUpdated', updateLightState);
    });
</script>

{#await loadLight()}
    Loading data...
{:then}
    <div id="title">
        <h1 class="text-4xl text-center py-6">{light.name}</h1>
    </div>
    <div id="content" class="flex flex-col md:flex-row justify-center">
        <div
            id="info"
            class="relative grid grid-cols-12 gap-4 p-4 uppercase bg-esidomlight w-full md:w-1/2 md:max-w-xl md:order-last"
        >
            <div class="col-span-full text-center font-semibold text-xl">
                Informations
            </div>

            <div class="col-span-3 row-start-2 text-right">
                {tr('entities.menu.name')}
            </div>
            <div class="col-span-9 row-start-2">{light.name}</div>
            <div class="col-span-3 row-start-3 text-right">
                {tr('entities.menu.type')}
            </div>
            <div class="col-span-9 row-start-3">{light.type}</div>
            <div class="col-span-3 row-start-4 text-right">
                {tr('entities.menu.state')}
            </div>
            <div class="col-span-3 row-start-4">{light.state}</div>
            <div class="col-span-3 row-start-4">
                <ToggleButton
                    on:change={() => switchLamp(entityId, !isOn)}
                    bind:checked={isOn}
                />
            </div>
        </div>

        <div
            id="attributes"
            class="relative grid grid-cols-1 gap-4 pt-4 w-full md:pr-4 md:w-1/2 md:max-w-xl"
        >
            {#if isOn}
                {#each Object.entries(light.attributes) as [key, value] (key)}
                    {#if lightPropMap.has(key)}
                        <div class="text-center w-full">
                            <!-- {key}:{value} -->
                            <svelte:component
                                this={lightPropMap.get(key)}
                                {...{ value }}
                                on:valuechange={updateEntity}
                            />
                        </div>
                    {/if}
                {/each}
            {:else}
                {tr('entities.light.turnTheLightOn')}
            {/if}
        </div>
    </div>
{:catch error}
    Error:
    {error}
{/await}
