<script lang="ts">
    import Router from 'svelte-spa-router';
    import Navbar from './components/Navbar.svelte';

    import Devices from './routes/Devices.svelte';
    import Home from './routes/Home.svelte';

    const routes = {
        '/devices/': Devices,
        '/home/': Home,
        // This is optional, but if present it must be the last
        '*': Home,
    };
</script>

<main>
    <Navbar />
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
