<script lang="ts">
    import Device from '../../components/devices/Device.svelte';
    import Door from '../../components/devices/doors/Door.svelte';
    import LampNormal from '../../components/devices/lamps/LampNormal.svelte';
    import LampRgb from '../../components/devices/lamps/LampRGB.svelte';
    import Temperature from '../../components/devices/sensors/Temperature.svelte';
    import PairDevice from '../../components/pairing/PairDevice.svelte';
    import RoundedButton from '../../components/UI/buttons/RoundedButton.svelte';
    import DeviceContainer from '../../components/UI/container/DeviceContainer.svelte';

    let isPairDeviceOpen = false;
</script>

<div>
    <!-- Grid containing all devices -->

    <DeviceContainer title="Lampes" iconPath="favicon.png">
        <LampRgb entityId="light.zipato_bulb_2_level" />
        <LampNormal entityId="light.0x7cb03eaa0a03e828" />
    </DeviceContainer>

    <DeviceContainer title="Capteurs" iconPath="favicon.png">
        <Temperature
            entityId="fibaro_system_fgms001_zw5_motion_sensor_temperature"
        />
        <Door entityId="binary_sensor.0x00158d0003cc152c_contact" />
    </DeviceContainer>

    <DeviceContainer title="Tests" iconPath="favicon.png">
        <Device isError={true} />
        <Device isError={false}>
            <img slot="img" alt="" src="https://via.placeholder.com/400x400" />
        </Device>
    </DeviceContainer>

    <!-- <div
        class="devices grid grid-flow-row grid-cols-1 lg:grid-cols-4 mt-4 ml-4 gap-4"
    >
    </div> -->

    <!-- The + button to add device -->
    <div class="fixed bottom-0 right-0 h-16 w-16">
        <RoundedButton
            on:click={() => {
                isPairDeviceOpen = true;
            }}
            iconPath="icons/button/plus.svg"
        />
    </div>
</div>

{#if isPairDeviceOpen}
    <PairDevice
        on:cancel={() => {
            isPairDeviceOpen = false;
        }}
    />
{/if}

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
