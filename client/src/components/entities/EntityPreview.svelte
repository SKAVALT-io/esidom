<script>
    import type { Entity } from '../../../types/entityType';

    /* import { link } from 'svelte-spa-router';
    If we use:link in <a>, we can't middle click it (= open in new tab)
    */

    export let isError: boolean;
    export let entity: Entity<any>;
</script>

<div id="all" class="grid grid-cols-5" class:error={isError}>
    <div
        id="img"
        class="col-span-2 rounded-xl rounded-r-none flex items-center px-5"
    >
        {#if !isError}
            <slot name="img">
                <img
                    class="object-scale-down"
                    alt=""
                    src="https://via.placeholder.com/350x150"
                />
            </slot>
        {:else}:({/if}
    </div>

    <div
        id="data"
        class="col-span-3 rounded-xl rounded-l-none flex items-center px-3 py-8"
    >
        <a href="#/entity/{entity.id}">
            <slot name="name">NAME</slot>
        </a>
        {#if !isError}
            <slot name="sensor">PLACEHOLDER</slot>
        {:else}Data unavailable{/if}
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
