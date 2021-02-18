<script lang="ts">
    export let isOpen = false;
    function open() {
        isOpen = true;
    }
    function close() {
        isOpen = false;
    }
</script>

{#if isOpen}
    <div
        class="modal rounded shadow-lg fixed top-0 left-0 w-full h-screen flex justify-center items-center"
    >
        <div class="backdrop" on:click={close} />
        <div class="content-wrapper">
            <div class="content">
                <slot name="content" />
            </div>
        </div>
    </div>
{/if}

<style>
    div.backdrop {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
    }
    div.content-wrapper {
        z-index: 10;
        max-width: 70vw;
        border-radius: 0.3rem;
        background-color: #22164d;
        overflow: hidden;
    }
    div.content {
        max-height: 50vh;
        padding: 25px;
        overflow: auto;
    }
</style>
