<script lang="ts">
    // eslint-disable-next-line import/no-mutable-exports
    export let open = false;
</script>

<div class="hamburger flex items-center">
    <button
        class="hamburger-button mr-2"
        aria-label="open_menu"
        class:open
        on:click={() => {
            open = !open;
        }}
    >
        <svg class="w-8 h-8" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    </button>
    <img src="ps1.png" alt="ESIDOM" class="logo h-auto w-8" />
</div>

<style>
    svg {
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
    }
</style>
