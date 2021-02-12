<script>
    import LoadingAnimation from '../animations/LoadingAnimation.svelte';
    import CancelButton from '../UI/buttons/CancelButton.svelte';

    export let isPairDeviceOpen = false;

    function todo() {
        isPairDeviceOpen = false;
    }
</script>

{#if isPairDeviceOpen}
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
            <CancelButton on:click={todo} />
        </div>
    </div>
{/if}

<style>
    #page {
        z-index: 100;
    }
</style>
