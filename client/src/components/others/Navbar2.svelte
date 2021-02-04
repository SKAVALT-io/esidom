<script lang="ts">
    import Account from '../UI/Account.svelte';
    import Hamburger from '../UI/Hamburger.svelte';

    // eslint-disable-next-line import/no-mutable-exports
    export let sidebar = false;
</script>

<div class="navbar">
    <nav
        class="flex w-full items-center justify-between px-4 h-12 bg-gray-900 text-white border-b border-gray-100 z-10"
    >
        <Hamburger bind:open={sidebar} />
        <div class="nav-links flex items-center space-x-4">
            <a href="/#/devices/">Devices</a>
            <a href="/#/">Home</a>
            <Account />
        </div>
    </nav>
</div>

<style>
</style>
