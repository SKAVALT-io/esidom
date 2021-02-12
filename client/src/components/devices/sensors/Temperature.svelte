<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { socketManager } from '../../../managers/socketManager';
    import type { TemperatureData } from '../../../services/temperatureService';
    import { getTemp } from '../../../services/temperatureService';
    import Device from '../Device.svelte';

    export let entityId: string;
    let sensor: TemperatureData;
    // The actual temperature is in "state"
    let state: string;
    let name: string;

    $: name = sensor?.name;
    $: state = sensor?.state;

    // Handle the incoming socket data
    function dataChangeHandler(data: TemperatureData) {
        console.log('ws:new_state:', data);
        sensor = data;
    }

    async function loadDoor() {
        sensor = await getTemp(entityId);
        console.log('sensor loaded', sensor);
    }

    onMount(async () => {
        console.log('ON MOUNT SENSOR');
        await loadDoor();
        socketManager.registerListener(
            'entity_updated',
            sensor.id,
            dataChangeHandler
        );
    });

    onDestroy(() => {
        socketManager.removeListener('entity_updated', dataChangeHandler);
    });
</script>

<Device isError={sensor == undefined}>
    <!-- Image -->
    <img slot="img" src="/hot.svg" alt="" />
    <!-- Data -->
    <form slot="data" class="flex-auto p-6">
        <div class="flex flex-wrap">
            <h2 class="flex-auto text-base font-semibold">{name}</h2>
        </div>
        <div class="w-full flex-none font-medium text-red-500 mt-1">
            {state}
        </div>
    </form>
</Device>

<style lang="scss">
</style>
