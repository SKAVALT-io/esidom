<script lang="ts">
    import Door from '../../components/devices/Door.svelte';
    import Lamp from '../../components/devices/LampRGB.svelte';
    import Sensor from '../../components/devices/Sensor.svelte';
    import PairDevice from '../../components/others/PairDevice.svelte';
    import RoundedButton from '../../components/UI/buttons/RoundedButton.svelte';

    let isPairDeviceOpen = false;

    async function pair() {
        isPairDeviceOpen = true;
        const protocol = prompt('Protocol');

        const body = JSON.stringify({ protocol });
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        await fetch('http://localhost:3000/device', {
            headers,
            method: 'POST',
            body,
        }).then((x) => x.json());
        alert('✔️');
    }
</script>

<div id="test">
    <!-- Grid containing all devices -->
    <div class="devices grid grid-flow-row grid-cols-4 mt-4 ml-4 gap-4">
        <div>
            <Lamp />
        </div>
        <div class="col-span-2">
            <Sensor />
        </div>
        <div>
            <Door />
        </div>
        <!-- <div class="">
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
        </div> -->
    </div>

    <!-- The + button to add device -->
    <div class="absolute bottom-0 right-0 h-16 w-16">
        <RoundedButton on:click={pair} iconPath="icons/plus.svg" />
    </div>
</div>
<PairDevice bind:isPairDeviceOpen />

<style lang="scss">
    $color: rgb(8, 102, 0);

    div.devices div {
        border: 1px solid black;
        border-radius: 2px;
    }

    div {
        color: $color;
    }

    #test {
        margin-left: 4%;
    }
</style>
