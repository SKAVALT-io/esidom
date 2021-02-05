<script lang="ts">
    import Lamp from '../../components/devices/Lamp.svelte';
    import Sensor from '../../components/devices/Sensor.svelte';
</script>

<div id="test">
    <div class="grid grid-flow-col grid-rows-2 grid-cols-4 mt-4 ml-4">
        <div>
            <Lamp />
        </div>
        <div class="row-start-1 col-start-2">
            <Sensor />
        </div>
    </div>
    <div class="absolute bottom-0 right-0 h-16 w-16">
        <button
            class="py-2 px-4 bg-blue-400  text-white text-xl font-semibold rounded-full shadow-md hover:bg-blue-500 focus:outline-none absolute"
            type="button"
        >
            +
        </button>
    </div>
</div>

<style>
    div {
        color: white;
    }

    #test {
        margin-left: 4%;
    }
</style>
