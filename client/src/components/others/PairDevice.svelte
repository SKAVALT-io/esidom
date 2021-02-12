<script>
    import { createEventDispatcher } from 'svelte';
    import LoadingAnimation from '../animations/LoadingAnimation.svelte';
    import CancelButton from '../UI/buttons/CancelButton.svelte';

    const dispatch = createEventDispatcher();
</script>

<div
    id="page"
    class="flex top-0 left-0 w-screen h-screen absolute bg-white bg-opacity-30 justify-center items-center "
>
    <div
        class="pairDevice ml-10 mr-10 py-3 flex flex-col space-y-6 w-screen h-auto justify-center items-center bg-esidom"
    >
        <span class="text-xl uppercase text-center">Veuillez appairer votre
            objet</span>
        <LoadingAnimation />
        <CancelButton on:click={() => dispatch('cancel')} />
    </div>
</div>

<style>
    #page {
        z-index: 100;
    }
</style>
