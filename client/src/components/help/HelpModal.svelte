<script>
    import Modal from '../UI/modal/Modal.svelte';

    export let open = false;
    export let helpText = '';
</script>

<scrip />

<Modal bind:isOpen={open}>
    <div
        slot="content"
        class="flex flex-col space-y-2 ml-5 mr-5 mb-5 justify-center items-center"
    >
        <img class="w-7 h-7" src="icons/button/help.svg" alt="" />
        <div class="max-w-lg md:max-w-xl">
            {@html helpText}
        </div>
    </div>
</Modal>

<style>
</style>
