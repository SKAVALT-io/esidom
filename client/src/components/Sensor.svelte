<script lang="typescript">
    const sensor = { 
        entity_id: "sensor.fibaro_system_fgms001_zw5_motion_sensor_temperature",
        state: "unavailable",
        attributes: {
            restored: true,
            supported_features: 0,
            unit_of_measurement: "°C",
            friendly_name: "FIBARO System FGMS001-ZW5 Motion Sensor Temperature"
        },
        last_changed: "2020-12-17T14:09:07.024845+00:00",
        last_updated: "2020-12-17T14:09:07.024845+00:00",
        context: {
            id: "1c6e66796797066c8ae65da9c0ab3653",
            parent_id: null,
            user_id: null
        },
    };

    const name = sensor.attributes.friendly_name;
    const state = sensor.state;

</script>

<style>
    img {
        width: 80px;
        height: 80px;
    }

    .container_item {
        background-color: #a12b39;
    }

    .background_img_item {
        background-color: #b45561;
    }

    h2 {
        color: white;
    }

</style>

<template>
    <div class="container_item flex rounded-xl w-max min-w-full md:min-w-0">
        <div class="background_img_item flex rounded-xl  rounded-r-none ">
            <div class="flex-none w-20 relative mt-2">
                <img class = "object-contain md:object-scale-down"
                src= "/hot.svg"
                alt=""
                />
            </div>
        </div>
        <form class="flex-auto p-6">
            <div class="flex flex-wrap">
                <h2 class="flex-auto text-base font-semibold">
                    {name}
                </h2>
            </div>
            <div class="w-full flex-none font-medium text-red-500 mt-1">
                {state}
            </div>
        </form>
    </div>
</template>
