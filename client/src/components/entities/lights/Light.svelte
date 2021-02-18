<script>
    import { onDestroy, SvelteComponent } from 'svelte';
    import { onMount } from 'svelte';

    import {
        getLamp,
        switchLamp,
        updateLight,
    } from '../../../services/entities/lightService';

    import CancelButton from '../../UI/buttons/CancelButton.svelte';
    import RgbColorPicker from './things/RgbColorPicker.svelte';
    import BrightnessPicker from './things/BrightnessPicker.svelte';
    import ColorTemperaturePicker from './things/ColorTemperaturePicker.svelte';
    import { socketManager } from '../../../managers/socketManager';
    import type { LightEntity } from '../../../../types/entities/lightEntity';

    export let entityId: string;

    let light: LightEntity;
    let isOn = false;
    $: isOn = light?.state === 'on';

    async function loadLight() {
        light = await getLamp(entityId);
        console.log('light', light);
    }

    const lightPropMap = new Map<String, typeof SvelteComponent>();
    lightPropMap.set('rgb_color', RgbColorPicker);
    lightPropMap.set('brightness', BrightnessPicker);
    lightPropMap.set('color_temp', ColorTemperaturePicker);

    onMount(() => {
        socketManager.registerListener(
            'entity_updated',
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
        socketManager.removeListener('entity_updated', updateLightState);
    });

    const undetected: string[] = [];
</script>

{#await loadLight()}
    Loading data...
{:then l}
    <div>
        <h1>{light.name}</h1>

        <div
            id="info"
            class="left-1/4 relative w-1/2 grid grid-cols-12 gap-4 p-4 uppercase"
        >
            <div class="col-span-full text-center">Informations</div>

            <div
                class="col-span-6 row-start-2 text-center"
                on:click={() => switchLamp(entityId, !isOn)}
            >
                {isOn ? 'Éteindre' : 'Allumer'}
            </div>
            <div class="col-span-3 row-start-3">Nom:</div>
            <div class="col-span-3 row-start-3">{light.name}</div>
            <div class="col-span-3 row-start-4">Type:</div>
            <div class="col-span-3 row-start-4">{light.type}</div>
            <div class="col-span-3 row-start-5">Etat:</div>
            <div class="col-span-3 row-start-5">{light.state}</div>
        </div>

        <div id="attributes" class=" grid grid-cols-1 gap-4 p-4 m-4">
            {#if isOn}
                {#each Object.entries(light.attributes) as [key, value] (key)}
                    {#if lightPropMap.has(key)}
                        <div class="text-center">
                            <!-- {key}:{value} -->
                            <svelte:component
                                this={lightPropMap.get(key)}
                                {...{ value }}
                                on:valuechange={updateEntity}
                            />
                        </div>
                    {/if}
                {/each}
            {:else}Allumez l'appareil :){/if}
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
