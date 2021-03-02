<script lang="ts">
    import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
    import { tr } from '../../../utils/i18nHelper';

    export let value = '';
    export let debounce = 0;
    export let id = `search${Math.random().toString(36)}`;

    const dispatch = createEventDispatcher();

    let prevValue = value;
    let timeout: NodeJS.Timeout;
    let calling = false;

    function debounced(cb: () => void) {
        if (calling) return;
        calling = true;
        timeout = setTimeout(() => {
            cb();
            calling = false;
        }, debounce);
    }

    onMount(() => {
        return () => clearTimeout(timeout);
    });

    afterUpdate(() => {
        if (value.length > 0 && value !== prevValue) {
            if (debounce > 0) {
                debounced(() => dispatch('type', value));
            } else {
                dispatch('type', value);
            }
        }
        if (value.length === 0 && prevValue.length > 0) dispatch('clear');
        prevValue = value;
    });
</script>

<input
    class="border-2 searchBarColors h-8 px-5 pr-16 rounded-lg text-sm light"
    name="search"
    type="search"
    placeholder={tr('automations.search')}
    autocomplete="off"
    spellcheck={false}
    {...$$restProps}
    {id}
    bind:value
    on:input
    on:change
    on:keydown
/>

<style>
    .searchBarColors {
        background-color: #22164d;
        border-color: #22164d;
    }

    .searchBarColors:focus {
        --tw-border-opacity: 1;
        border-color: rgba(14, 165, 233, var(--tw-border-opacity));
    }
</style>
