<script>
    import { onDestroy, SvelteComponent } from 'svelte';
    import { onMount } from 'svelte';
    import { pop } from 'svelte-spa-router';

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

    import ToggleButton from '../../UI/buttons/ToggleButton.svelte';
    import BorderedButton from '../../UI/buttons/BorderedButton.svelte';

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
{:then}
    <div id="content" class="px-8">
        <div id="title">
            <!-- <button
                on:click={pop}
                class="border-white border-2 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
            >Retour</button> -->
            <h1 class="text-4xl text-center py-6">{light.name}</h1>
        </div>

        <div
            id="info"
            class="relative grid grid-cols-12 gap-4 p-4 uppercase bg-esidomlight w-full md:w-4/6 md:left-1/6 max-w-5xl"
        >
            <div class="col-span-full text-center font-semibold text-xl">
                Informations
            </div>

            <!-- <div
                class="col-span-6 row-start-2 text-center"
                on:click={() => switchLamp(entityId, !isOn)}
            >
                <button
                    on:click={pop}
                    class="border-white border-2 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                >{isOn ? 'Éteindre' : 'Allumer'}</button>
                <ToggleButton
                    on:change={() => switchLamp(entityId, !isOn)}
                    bind:{isOn}
                />
            </div> -->
            <div class="col-span-3 row-start-3 text-right">Nom :</div>
            <div class="col-span-9 row-start-3">{light.name}</div>
            <div class="col-span-3 row-start-4 text-right">Type :</div>
            <div class="col-span-9 row-start-4">{light.type}</div>
            <div class="col-span-3 row-start-5 text-right">Etat :</div>
            <div class="col-span-3 row-start-5">{light.state}</div>
            <div class="col-span-3 row-start-5">
                <ToggleButton
                    on:change={() => switchLamp(entityId, !isOn)}
                    bind:isOn
                />
            </div>
        </div>

        <div
            id="attributes"
            class="relative grid grid-cols-1 gap-4 p-4 w-full md:w-4/6 md:left-1/6 max-w-5xl"
        >
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
            {:else}
                Allumez l'appareil si vous souhaitez configurer la lampe.
            {/if}
        </div>
    </div>
{:catch error}
    Error:
    {error}
{/await}

<!--<style lang="scss">
    #info {
        border: 1px solid yellow;
        div:not(:first-child) {
            border: 1px solid yellow;
        }
    }
</style>-->
