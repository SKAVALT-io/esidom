<script>
    import { createEventDispatcher } from 'svelte';
    import RoundedButton from '../buttons/RoundedButton.svelte';

    export let value: string;
    export let placeholder = '';

    const dispatch = createEventDispatcher();

    let edition = false;
    async function handleClick() {
        dispatch('edition', edition);
        edition = !edition;
    }
</script>

<div>
    {#if edition}
        <input
            type="text"
            class="px-2 py-2 pr-4 placeholder-gray-400 text-gray-900 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline"
            {placeholder}
            bind:value
        />
    {:else}
        <p class="inline-block" on:dblclick={handleClick}>{value}</p>
    {/if}
    <RoundedButton
        size={11}
        iconPath={edition ? 'icons/button/check.svg' : 'icons/button/edit.svg'}
        on:click={handleClick}
        bgColor="bg-esidom"
    />
</div>
