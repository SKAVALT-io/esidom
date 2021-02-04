<script>
    // eslint-disable-next-line import/no-mutable-exports
    export let open = false;

    $: if (open) {
        document.body.style.setProperty('overflow', 'hidden');
    } else {
        document.body.style.removeProperty('overflow');
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && open) open = false;
    });
</script>

<aside
    class="transform top-0 left-0 w-64 bg-gray-900 fixed h-full overflow-auto ease-in-out z-30"
    class:open
>
    <span class="flex w-full items-center p-4 border-b">
        <h1>ESIDOM</h1>
    </span>
    <span
        class="flex items-center p-4 hover:bg-indigo-500 hover:text-white "
        on:click={() => {
            open = false;
        }}
    ><span class="mr-2">
            <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                class="w-6 h-6"
            >
                <path
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
            </svg>
        </span>
        <a href="/#/">Home</a>
    </span>
    <span
        class="flex items-center p-4 hover:bg-indigo-500 hover:text-white "
        on:click={() => {
            open = false;
        }}
    ><span class="mr-2">
            <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                class="w-6 h-6"
            >
                <path
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
            </svg>
        </span>
        <a href="/#/devices/">Devices</a>
    </span>
</aside>

<style>
    aside {
        left: -17%;
        transition: left 0.3s ease-in-out;
    }

    .open {
        left: 0px;
        transition: 100%;
    }
</style>
