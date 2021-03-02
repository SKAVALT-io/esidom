<script>
    import { createEventDispatcher } from 'svelte';
    import { hexToRgb, rgbToHex } from '../../../../utils/functions';

    export let value: [number, number, number];
    let [r, g, b] = value;
    $: [r, g, b] = value;

    const dispatch = createEventDispatcher();
    const colorCallback = (e: any) => {
        const hex = e.target.value;
        const [r, g, b] = hexToRgb(hex);
        dispatch('valuechange', {
            rgb_color: [r, g, b],
        });
    };

    let HEXA = '';
    $: HEXA = rgbToHex(r, g, b);
</script>

<input
    type="color"
    name=""
    id=""
    value={HEXA}
    on:change={colorCallback}
    class="w-1/2 h-32"
/>
