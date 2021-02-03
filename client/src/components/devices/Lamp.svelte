<script lang="ts">
    const LAMP = {
        entity_id: 'light.0x7cb03eaa0a03e828',
        state: 'on',
        attributes: {
            effect_list: [
                'blink',
                'breathe',
                'okay',
                'channel_change',
                'finish_effect',
                'stop_effect',
            ],
            brightness: 23,
            linkquality: 110,
            state: 'ON',
            update: {
                state: 'available',
            },
            update_available: true,
            friendly_name: '0x7cb03eaa0a03e828',
            supported_features: 45,
        },
        last_changed: '2020-12-17T14:09:40.148957+00:00',
        last_updated: '2020-12-17T14:09:40.148957+00:00',
        context: {
            id: '29a23755fd4524ce1c7c27f6274dd383',
            parent_id: null,
            user_id: null,
        },
    };
    const name = LAMP.entity_id.split('.')[0];
    let isOn = LAMP.state === 'on';
    $: srcLamp = isOn ? 'lampe-allumee.png' : 'lampe-eteinte.png';

    let br = LAMP.attributes.brightness;

    function switchLamp() {
        const body = JSON.stringify(
            isOn
                ? {
                    domain: 'light',
                    service: 'turn_off',
                }
                : {
                    domain: 'light',
                    service: 'turn_on',
                    service_data: {
                        brightness_pct: 25,
                    },
                },
        );
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');

        fetch(`http://localhost:3000/entity/state/${LAMP.entity_id}`, {
            headers,
            method: 'PUT',
            body,
        })
            .then((x) => x.text())
            .then(console.log)
            .catch(console.log);
        isOn = !isOn;
    }

    function change() {
        const body = JSON.stringify({
            domain: 'light',
            service: 'turn_on',
            service_data: {
                brightness_pct: br,
            },
        });
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        fetch(`http://localhost:3000/entity/state/${LAMP.entity_id}`, {
            headers,
            method: 'PUT',
            body,
        });
    }
</script>

<template>
    <div class="container_item flex rounded-xl w-max min-w-full md:min-w-0">
        <div class="background_img_item flex rounded-xl  rounded-r-none ">
            <div class="flex-none w-20 relative mt-2">
                <img class="object-contain md:object-scale-down" src={srcLamp} alt="" on:click={switchLamp} />
            </div>
        </div>
        <form class="flex-auto p-6">
            <div class="flex flex-wrap">
                <h2 class="flex-auto text-base font-semibold">
                    Lamp:
                    {name}
                    is
                    {isOn ? 'on' : 'off'}
                </h2>
            </div>
            <div class="w-full flex-none text-xs font-medium text-white mt-1">
                {#if isOn}
                <input type="range" bind:value={br} on:change={change} />
                {/if}
                ({br})
            </div>
        </form>
    </div>
</template>

<style>
    img {
        width: 80px;
        height: 80px;
    }

    .container_item {
        background-color: #689d59;
    }

    .background_img_item {
        background-color: #86b17a;
    }

    h2 {
        color: white;
    }
</style>