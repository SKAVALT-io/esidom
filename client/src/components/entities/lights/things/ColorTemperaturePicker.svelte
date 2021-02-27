<script>
    import { createEventDispatcher } from 'svelte';

    import { debounce } from '../../../../utils/functions';
    import { tr } from '../../../../utils/i18nHelper';

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

<div class="w-inherit">
    <p>{tr('devices.colorTemperature')} : {value.toFixed(0)}°K</p>
    <input
        id="tempColor"
        type="range"
        min="153"
        max="500"
        bind:value
        on:change={tempColorChangeHandler}
        class="w-inherit"
    />
</div>

<style>
    #tempColor {
        background: linear-gradient(
            to right,
            #0089ff 0%,
            #ffffff 50%,
            #f00 100%
        );
        border-radius: 8px;
        height: 7px;
        outline: none;
        transition: background 450ms ease-in;
        appearance: none;
    }
</style>
