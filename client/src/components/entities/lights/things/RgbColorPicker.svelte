<script>
    import { createEventDispatcher } from 'svelte';

    import { HsvPicker } from 'svelte-color-picker';
    import { rgbToHex } from '../../../../services/entities/lightService';
    import { debounce } from '../../../../utils/functions';

    export let value: [number, number, number];
    let [r, g, b] = value;
    $: [r, g, b] = value;

    // Because color picker emits a signal at start, and we don't want it
    let first = true;

    const colorCallback = debounce((rgba: any) => {
        // console.log(rgba.detail);
        const { r, g, b } = rgba.detail;
        if (first) {
            first = false;
        } else {
            dispatch('valuechange', {
                rgb_color: [r, g, b],
            });
        }
    });

    const dispatch = createEventDispatcher();
    const HEXA = rgbToHex(r, g, b);
</script>

<div style="background-color: rgb({r}, {g}, {b})">
    ({r},
    {g},
    {b})
    {value}
    <HsvPicker on:colorChange={colorCallback} startColor={HEXA} />
    <!-- Bug: color picked value doesn't change when the a new value comes,
    need to code a better color picker -->
</div>
