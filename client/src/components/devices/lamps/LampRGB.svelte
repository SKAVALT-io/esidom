<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { HsvPicker } from 'svelte-color-picker';
    import { debounce } from '../../../utils/functions';
    import Device from '../Device.svelte';
    import type { LampData } from '../../../services/lampService';
    import {
        changeBrightness,
        changeLampRGB,
        getLamp,
        rgbToHex,
        switchLamp,
    } from '../../../services/lampService';
    import { socketManager } from '../../../managers/socketManager';

    // Entity id of the current entity
    export let entityId: string;
    // The data
    let LAMP: LampData;
    // Is it on or off
    let isOn: boolean;
    // The brightness of the lamp
    let brightness: number;
    // The src for the icon
    let srcLamp: string;
    let state: string;
    let rgb: number[];
    let HEXA: string;

    $: state = LAMP?.state;
    $: isOn = state === 'on';
    $: srcLamp = isOn ? 'lampe-allumee.png' : 'lampe-eteinte.png';
    $: brightness = LAMP?.attributes.brightness;
    $: rgb = LAMP?.attributes.rgb_color;
    $: HEXA = rgb?.[0] ? rgbToHex(rgb[0], rgb[1], rgb[2]) : '#ff00ff';

    async function switchLampHelper() {
        await (isOn
            ? switchLamp(LAMP.id)
            : switchLamp(LAMP.id, brightness ? (brightness / 255) * 100 : 50));
        isOn = !isOn;
    }

    async function brightnessChangeHandler() {
        await changeBrightness(LAMP.id, (brightness / 255) * 100);
    }

    // Handle the incoming socket data
    function dataChangeHandler(data: LampData) {
        console.log('ws:new_state:', data);
        LAMP = data;
    }

    const colorCallback = debounce((rgba: any) => {
        console.log(rgba.detail);
        const { r, g, b } = rgba.detail;
        changeLampRGB(LAMP.id, r, g, b);
    });

    async function loadLamp() {
        LAMP = await getLamp(entityId);
        console.log('Lamp RGB', LAMP);
    }

    onMount(async () => {
        console.log('ON MOUNT LAMP');
        await loadLamp();
        socketManager.registerListener(
            'entity_updated',
            LAMP.id,
            dataChangeHandler
        );
    });

    onDestroy(() => {
        socketManager.removeListener('entity_updated', dataChangeHandler);
    });
</script>

<!-- <HsvPicker on:colorChange={colorCallback} startColor={HEXA} /> -->
<Device isError={LAMP == undefined}>
    <!-- Image -->
    <img slot="img" src={srcLamp} alt="" on:click={switchLampHelper} />
    <!-- Data -->
    <div slot="data" class="flex w-max min-w-full">
        <form class="flex-auto p-6">
            <div class="flex flex-wrap">
                <h2 class="flex-auto text-base font-semibold">
                    Lamp:
                    {LAMP.name}
                    is
                    {isOn ? 'on' : 'off'}
                </h2>
            </div>
            <div class="w-full flex-none text-xs font-medium text-white mt-1">
                {#if isOn}
                    <input
                        type="range"
                        max="255"
                        bind:value={brightness}
                        on:change={brightnessChangeHandler}
                    />
                    ({brightness})
                {/if}
            </div>
        </form>
    </div>
</Device>

<style>
</style>
