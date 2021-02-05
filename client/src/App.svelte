<script lang="ts">
    import Router from 'svelte-spa-router';

    import Devices from './routes/devices/Devices.svelte';
    import Home from './routes/default/Home.svelte';

    import Navbar from './components/others/Navbar.svelte';

    const routes = {
        '/devices/': Devices,
        '/home/': Home,
        // This is optional, but if present it must be the last
        '*': Home,
    };
</script>

<main>
    <Navbar />
    <!-- <Sidebar bind:open /> -->
    <Router {routes} />
</main>

<style>
    :global(body) {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        background-color: #120639;
        color: white;
    }
</style>
