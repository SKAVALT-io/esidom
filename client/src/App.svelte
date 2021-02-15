<script lang="ts">
    import Router from 'svelte-spa-router';

    import { addMessages, init, getLocaleFromNavigator, _ } from 'svelte-i18n';

    import fr from 'locales/fr.json';
    import en from 'locales/en.json';

    import Blockly from './routes/automation/Blockly.svelte';
    import Devices from './routes/devices/Devices.svelte';
    import Home from './routes/default/Home.svelte';
    import Automations from './routes/automation/Automations.svelte';

    import Navbar from './components/others/Navbar.svelte';
    import { socketManager } from './managers/socketManager';
    import Sidebar from './components/others/Sidebar.svelte';

    // Configure the app routes
    const routes = {
        '/devices/': Devices,
        '/home/': Home,
        '/blockly': Blockly,
        '/automations': Automations,
        // This is optional, but if present it must be the last
        '*': Home,
    };

    // Is sidebar open
    let open = false;

    // Configure and init i18n
    addMessages('fr', fr);
    addMessages('en', en);

    init({
        fallbackLocale: 'fr',
        initialLocale: getLocaleFromNavigator(),
    });

    // Initiate the socket
    socketManager.connect();
</script>

<main>
    <div class="grid grid-cols-20 grid-rows-12 h-screen">
        <div class="row-span-1 col-span-full" id="non">
            <Navbar on:press={() => (open = !open)} />
        </div>
        <div class="row-start-2 row-span-full col-span-1" id="oui">
            <Sidebar bind:open />
        </div>
        <div
            class="row-start-2 row-span-full col-start-2 col-span-full"
            id="rest"
        >
            <Router {routes} />
        </div>
    </div>
</main>

<style lang="scss">
    div > div {
        border: 1px solid rgb(219, 226, 188);
    }

    :global(body) {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        background-color: #120639;
        color: white;
    }
</style>
