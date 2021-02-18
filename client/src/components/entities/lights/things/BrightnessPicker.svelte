<script>
    import { createEventDispatcher } from 'svelte';

    import { debounce } from '../../../../utils/functions';

    // Brightness value, between 0 and 255
    export let value: number;
    let brightnessPct: number;
    $: brightnessPct = +((value / 255) * 100).toFixed(0);

    const dispatch = createEventDispatcher();
    const brightnessChangeHandler = debounce((event: any) => {
        console.log(event);
        dispatch('valuechange', {
            brightness_pct: brightnessPct,
        });
    });
</script>

Brightness:
<input
    type="range"
    min="0"
    max="255"
    bind:value
    on:change={brightnessChangeHandler}
/>
{brightnessPct}
%
