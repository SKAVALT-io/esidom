<script lang="ts">
    import { io } from "socket.io-client";
    import { onDestroy, onMount } from "svelte";
    import { HsvPicker } from "svelte-color-picker";

    interface Truc {
        name: string;
        id: string;
        state: string;
        type: string;
        attributes: {
            rgb_color: number[];
            brightness: number;
        };
    }

    const r = 0;

    console.log(r);
    let LAMP: Truc;

    function switchLamp() {
        const body = JSON.stringify(
            isOn
                ? {
                      service: "light.turn_off",
                  }
                : {
                      service: "light.turn_on",
                      serviceData: {
                          brightness_pct: 25,
                      },
                  }
        );
        const headers = new Headers();
        headers.set("Content-Type", "application/json");

        fetch(`http://localhost:3000/entity/${LAMP.id}`, {
            headers,
            method: "PUT",
            body,
        })
            .then((x) => x.text())
            .then(console.log)
            .catch(console.log);
        isOn = !isOn;
    }

    function change() {
        const body = JSON.stringify({
            service: "light.turn_on",
            serviceData: {
                brightness_pct: (brightness / 255) * 100,
            },
        });
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        fetch(`http://localhost:3000/entity/${LAMP.id}`, {
            headers,
            method: "PUT",
            body,
        });
    }

    let isOn: boolean;
    $: isOn = state === "on";
    let srcLamp: string;
    $: srcLamp = isOn ? "lampe-allumee.png" : "lampe-eteinte.png";
    let state: string, brightness: number, rgb: number[];

    let socket: any;
    function haha(data: any) {
        console.log("ws", data);
        if (data.entity_id === LAMP.id) {
            const new_state = data.new_state as Truc;
            console.log("state", new_state);

            state = new_state.state;
            rgb = new_state.attributes.rgb_color ?? [];
            brightness = new_state.attributes.brightness ?? 0;
        }
    }

    onMount(async () => {
        //
        const LAMP__ = await fetch(
            `http://localhost:3000/entity/light.zipato_bulb_2_level`
        ).then((x) => x.json());
        LAMP = LAMP__ as Truc;
        LAMP.name = LAMP__.name;
        console.log(LAMP);

        state = LAMP.state;
        brightness = LAMP.attributes.brightness;
        rgb = LAMP.attributes.rgb_color ?? [];

        socket = io("http://localhost:3000");
        socket.on("entity_updated", haha);
    });

    onDestroy(() => {
        console.log("oof je dead ça");
        socket.off("entity_updated", haha);
    });

    function debounce(func: Function, timeout?: number) {
        let timer: number | undefined;
        return (...args: any[]) => {
            const next = () => func(...args);
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(next, timeout > 0 ? timeout : 300);
        };
    }

    const colorCallback = debounce((rgba: any) => {
        console.log(rgba.detail);
        const { r, g, b } = rgba.detail;

        const body = JSON.stringify({
            service: "light.turn_on",
            serviceData: {
                rgb_color: [r, g, b],
            },
        });
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        fetch(`http://localhost:3000/entity/${LAMP.id}`, {
            headers,
            method: "PUT",
            body,
        });
    });
</script>

{#if LAMP}
    <HsvPicker on:colorChange={colorCallback} startColor={'#FBFBFB'} />

    <div
        style="background-color: rgb({rgb[0]}, {rgb[1]}, {rgb[2]})"
        class="container_item flex rounded-xl w-max min-w-full md:min-w-0"
    >
        <div class="background_img_item flex rounded-xl  rounded-r-none ">
            <div class="flex-none w-20 relative mt-2">
                <img
                    class="object-contain md:object-scale-down"
                    src={srcLamp}
                    alt=""
                    on:click={switchLamp}
                />
            </div>
        </div>
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
                        on:change={change}
                    />
                    ({brightness})
                {/if}
            </div>
        </form>
    </div>
{:else}Data unavailable{/if}

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
