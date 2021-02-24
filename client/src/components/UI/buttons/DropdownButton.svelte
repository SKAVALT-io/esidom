<script lang="ts">
    import { createEventDispatcher } from 'svelte/internal';

    export let dropDownOptions: string[];
    export let title: string;
    export let arrowUp: boolean = false;
    const dispatch = createEventDispatcher();
</script>

<!-- Exemple of use
    <DropdownButton on:click={myFunction} dropDownOptions={['option1', 'option2']}, title={'Sort by'} /> 
-->
<div class="dropdown inline-block relative">
    <button
        class=" text-white font-semibold px-4 rounded inline-flex items-center"
    >
        <span class="mr-1">{title}</span>
        <svg
            class="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
        ><path
                class:reverse={arrowUp}
                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
            />
        </svg>
    </button>
    <ul class="dropdown-menu z-10 absolute hidden text-gray-700 pt-1">
        {#each dropDownOptions as option, i}
            <button
                id={`option${i}`}
                on:click={() => dispatch('click', i)}
                class="block w-full cursor-pointer bg-gray-100 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
            >
                {option}
            </button>
        {/each}
    </ul>
</div>

<style>
    .dropdown:hover .dropdown-menu {
        display: block;
    }

    .reverse {
        transform: scale(1, -1);
        transform-origin: center;
    }
</style>
