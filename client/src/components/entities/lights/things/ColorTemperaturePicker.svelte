<script>
    import { createEventDispatcher } from 'svelte';

    import { debounce } from '../../../../utils/functions';

    // Color temperature value, between 153 and 500
    export let value: number;

    const dispatch = createEventDispatcher();
    const tempColorChangeHandler = debounce((event: any) => {
        console.log(event);
        dispatch('valuechange', {
            color_temp: value,
        });
    });
</script>

Color temperature :
<input
    type="range"
    min="153"
    max="500"
    bind:value
    on:change={tempColorChangeHandler}
/>
{value.toFixed(0)}°?
