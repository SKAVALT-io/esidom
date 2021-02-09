<script lang="ts">
    import { io } from 'socket.io-client';
    import { onDestroy, onMount } from 'svelte';

    interface Truc {
        name: string;
        id: string;
        state: string;
        type: string;
        attributes: {
            contact: boolean;
        };
    }

    let LAMP: Truc;

    let isShut: boolean;
    let srcLamp: string;
    $: srcLamp = isShut
        ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAYFBMVEX///8AAABnZ2eXl5ebm5tjY2PPz88mJiYjIyPExMTAwMCLi4vx8fGFhYU5OTlAQEBGRkZNTU1UVFRbW1sNDQ22traxsbGqqqqjo6NycnL4+Pjk5OQxMTEXFxfMzMx6enoB2QHkAAABJ0lEQVR4nO3by0rDQBSA4dimzdWqtTX2Zt//LY2lSKiIUIjkDN8Ps8jmMN9mmFkkyyRJkiRJ0lf1Yryq/4TMH8YrBwEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQGZIqRo8qZMAFK0/bx2IIkKaS4DH+ND8tuB0SDl6un5Zf16/cktLqT8dWAwyGZb1du37j1vg0O+W4KAgPwBqXb7NCCLfoFMCTJLBXLoEro0HuNDTh9Ztj//kMWD9E+r42n4GRdyEwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMjUICPubLRAplbakFnA7jsNJEmSJEkK0CebpUSQ/RNXzwAAAABJRU5ErkJggg=='
        : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAaVBMVEX///8AAACenp4uLi739/fr6+vS0tL8/PxoaGjk5ORubm6WlpahoaHHx8fy8vKDg4MxMTFUVFSvr6/Dw8N5eXkLCwtzc3O6uroZGRlaWlpCQkIeHh44ODiNjY1HR0fd3d20tLRNTU09PT2ske4iAAAEdElEQVR4nO3dfXPpQBjG4URJRAiC0qrifP8PedZbEE/ae0/2JbPn/v1lzGhyTeiTMFYUIaXTTdy1NtMU2ncM+OabIzYzJ8x9WxrqGRN++qY0dDQm7OaTNI7fKKQQEK62K4eiek6O4XCihknfcZk14ZdkXOWZsQ2BDawJi2wnHsjPsm9sW0j2hAN1ezJqfLY6y64wivqHbxE53Rvb4C/ZFp42kW8l42w8+OnPGMuBUJUsxQM5XxvbanNuhGpIrD9E5DIxtuGGXAlVxXgmGW0PEIdC1X4qHsjv0uD1aT23QtVkKCLtDRDnQjVASvEScmVpgHgQqrKmAVIY240qP0JV8i4+W80PEG/C0wCZi0jDA8Sj8LT1nnittTE5QPwKox8GiKkrEO9C1cLqAOmCUJ3ulPLpjokB0g2hKtuJnwUcW8+PzghViXS9/Nl2f7okVAPkcHwhtn01dkt42qFe7XRn3HJ/OieM6tfLbT9R6aJQ9XC9HKhQDZBR6MJoHLywRyEYhfpRiEYhGoX6UYhGIRqF+lGIRiEahfpRiEYhGoX6UYhGIRqF+lGIRiEahfpRiEYhGoX6UYhGIRqF+lGIRiEahfpRiEYhGoX6UYhGIRqF+lGIRiEahfpRiEYhGoX6UYhGIRqF+lGIRiEahfr9s7CfLJKHhRSCEyaX78XOq2U/QhPev9y8vN4TmPBxIbCPy11hCZ/XN5me7wtKmMTPnV+LQQnrC5t8ne4MSTiJ653WwghJWC3AU61yNozCEt5co6ha/ysKSlj9nxlExe3mPihheX3AXN2+rW92CEp4W244j+6L8udBCW8vvtNqe+vr7WWQwoW6vbjeHgUlvJ10Px7D96CED6+9irULSnj7X3r6AYrb/9IyKOH++oC4uM/DJCihdE6ThiUM/7w0/GuLqP5DEedfLgpKGP41fvjv0/wH77X9B++Xqtfi5XQm3Pe8o/A/t3iJQjQK9aMQjUI0CvWjEI1CNAr1oxCNQjQK9aMQjUI0CvWjEI1CNAr1oxCNQjQK9aMQjUI0CvWjEI1CNAr1oxCNQjQK9aMQjUI0CvWjEI1CNAr1oxCNQjQK9aMQjUI0CvWjEI1CNAr1oxCNQjQK9TMlHIcuLEZhC9f3rz6HKEzuX3sOUTjobeOnxi33p1vC9HCM601a7k+XhMnohXddQ7FNnRFmu43gi//0f3/oz3VDWJT15S/Prab79vvTBeFiKPHiYdtX4CXvwv1U5H2XrZ+e1/wKB703ibfJM2O741OYrucSL14mvz1SK2/C5F3kzdfGduSaH2GWbyXebFwY240qD8J++SnxjIwGIefCidXRIORW2DgaUmObf8mhsBjLJy4mR4OQK2G6/pB4pkeDkBvh8zVtlfnRIORAOGgaDW3fq8KyLewfvsXDZ2k0CNkVTqRrWpujQciesMh2Is/cVQOWPWF9yc5ztkeDkD1hw7Mz7TsucyhcbVfNeus5OYZeo5DCe0fflIaOxoT57xvzUm5MmHbzaTozBlRE+f15r2122DX2X+7bR46ZmdwUAAAAAElFTkSuQmCC';

    let socket: any;
    function haha(data: any) {
        console.log('ws', data);
        if (data.entity_id === LAMP.id) {
            const new_state = data.new_state as Truc;
            console.log('state', new_state);

            isShut = new_state.attributes.contact;
        }
    }

    onMount(async () => {
        const LAMP__ = await fetch(
            `http://localhost:3000/entity/hehexd`
        ).then((x) => x.json());
        console.log('DOOR', LAMP__);
        if (LAMP__.data) {
            LAMP = LAMP__.data[0] as Truc;
            LAMP.name = LAMP__.name;
            console.log(LAMP);

            isShut = LAMP.attributes.contact;

            socket = io('http://localhost:3000');
            socket.on('entity_updated', haha);
        }
    });

    onDestroy(() => {
        console.log('oof je dead ça');
        socket.off('entity_updated', haha);
    });
</script>

{#if LAMP}
    <div class="container_item flex rounded-xl w-max min-w-full md:min-w-0">
        <div class="background_img_item flex rounded-xl  rounded-r-none ">
            <div class="flex-none w-20 relative mt-2">
                <img
                    class="object-contain md:object-scale-down"
                    src={srcLamp}
                    alt=""
                />
            </div>
        </div>
        <form class="flex-auto p-6">
            <div class="flex flex-wrap">
                <h2 class="flex-auto text-base font-semibold">
                    {LAMP.name}
                    is
                    {isShut ? 'shut' : 'open'}
                </h2>
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
