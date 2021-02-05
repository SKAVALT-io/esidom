<script lang="ts">
    import Device from '../../components/devices/Device.svelte';
    import Lamp from '../../components/devices/Lamp.svelte';
    import Sensor from '../../components/devices/Sensor.svelte';
</script>

<div>
    <!-- Grid containing all devices -->
    <div class="devices grid grid-flow-row grid-cols-4 mt-4 ml-4 gap-4">
        <div>
            <Lamp />
        </div>
        <div class="col-span-2">
            <Sensor />
        </div>
        <div class="">
            lol
            <Device />
        </div>
        <div>
            <Device>
                <img slot="img" src="https://via.placeholder.com/350x150" />
            </Device>
        </div>
        <div>
            <Device />
        </div>
        <div>
            <Device />
        </div>
        <div>
            <Device />
        </div>
    </div>

    <!-- The + button to add device -->
    <div class="absolute bottom-0 right-0 h-16 w-16">
        <button
            class="py-2 px-4 bg-blue-400  text-white text-xl font-semibold rounded-full shadow-md hover:bg-blue-500 focus:outline-none absolute"
            type="button"
        >
            +
        </button>
    </div>
</div>

<style lang="scss">
    $color: rgb(8, 102, 0);

    div.devices div {
        border: 1px solid black;
        border-radius: 2px;
    }

    div {
        color: $color;
    }
</style>
