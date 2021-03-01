<script>
    import type { Entity } from '../../../types/entityType';
    import Tooltip from '../UI/utils/Tooltip.svelte';
    import { tr } from '../../utils/i18nHelper';

    /* import { link } from 'svelte-spa-router';
    If we use:link in <a>, we can't middle click it (= open in new tab)
    */

    export let isError: boolean;
    export let entity: Entity<any>;
    let show = false;
    let error = false;
    $: error = entity.state === 'unavailable' || isError;

    function parseStringByLength(str: string, len = 20): string {
        return str
            ? str.length >= len
                ? str.substring(0, 20) + '...'
                : str
            : '<Sans nom>';
    }
</script>

<div
    id="all"
    class="grid hover:border hover:border-green-700 grid-cols-5 max-w-lg max-h-32"
    class:error
>
    <div
        id="img"
        class="col-span-2 rounded-xl rounded-r-none flex items-center p-4 h-inherit"
    >
        <slot name="img" class="text">
            <img
                class="object-scale-down"
                alt=""
                src="https://via.placeholder.com/350x150"
            />
        </slot>
    </div>
    <!-- flex items-center px-3 py-8 -->
    <div
        id="data"
        class="col-span-3 rounded-xl rounded-l-none grid grid-rows-6 items-center text-center h-inherit"
    >
        <div
            class="row-span-1 row-start-2 relative"
            on:touchstart={() => (show = true)}
            on:touchend={() => (show = false)}
            on:mouseleave={() => (show = false)}
            on:mouseenter={() => (show = true)}
        >
            <a href="#/entity/{entity.id}" class="text-white">
                {parseStringByLength(entity.name)}
            </a>
            {#if entity.name}
                <Tooltip text={entity.name} position="top" {show} />
            {/if}
        </div>
        <div class="row-span-4 text-white">
            {#if !error}
                <slot name="sensor">PLACEHOLDER</slot>
            {:else}{tr('devices.dataUnavailable')}{/if}
        </div>
    </div>
</div>

<style lang="scss">
    #all {
        height: 120px;

        #img {
            background-color: #7ea874;
        }

        #data {
            background-color: #5e9251;
        }
    }

    #all.error {
        #img {
            background-color: #b45561;
        }

        #data {
            background-color: #a12b39;
        }
    }
</style>
