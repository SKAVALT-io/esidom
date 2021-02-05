<script lang="ts">
    import Sidebar from './Sidebar.svelte';

    let open = false;
    const sideBarIsOpen = () => (open = !open);
</script>

<nav
    class="top-navbar flex-wrap flex w-full items-center justify-between px-3.5 h-12 bg-gray-900 text-white border-b border-gray-100 z-10"
>
    <div class="hamburger flex items-center">
        <button
            class="hamburger-button mr-2"
            class:open
            on:click={sideBarIsOpen}
        >
            <svg
                class="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
            >
                <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
        <img src="logo-esidom.png" alt="ESIDOM" class="logo h-auto w-12" />
    </div>
    <div class="nav-links flex items-center space-x-4">
        <a
            href="/#/devices/"
            class="lg:inline-flex lg:w-auto w-full py-2 rounded text-gray-400 items-center justify-center hover:bg-gray-900 hover:text-white"
        >
            <span> Devices </span>
        </a>
        <a
            href="/#/"
            class="lg:inline-flex lg:w-auto w-full py-2 rounded text-gray-400 items-center justify-center hover:bg-gray-900 hover:text-white"
        >
            <span>Home</span>
        </a>
        <a
            href="/#/"
            class="lg:inline-flex lg:w-auto w-full py-2 rounded text-gray-400 items-center justify-center hover:bg-gray-900 hover:text-white"
        >
            <svg
                class="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
            >
                <path
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        </a>
    </div>
</nav>
<Sidebar bind:open />

<style>
</style>
