<script lang="ts">
    import AccountSVG from '../svg_icons/AccountSVG.svelte';
    import HamburgerSVG from '../svg_icons/HamburgerSVG.svelte';
    import Sidebar from './Sidebar.svelte';

    let open = false;
    const sideBarIsOpen = () => {
        open = !open;
    };
</script>

<nav
    class="top-navbar flex-wrap flex w-full items-center justify-between px-3.5 h-12 bg-gray-900 text-white border-b border-gray-100 z-10"
>
    <div class="hamburger flex items-center">
        <button
            class="hamburger mr-2 text-gray-400 hover:text-white"
            class:open
            on:click={sideBarIsOpen}
        >
            <HamburgerSVG />
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
            <AccountSVG />
        </a>
    </div>
</nav>
<Sidebar bind:open />

<style>
</style>
