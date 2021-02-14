<script lang="ts">
    import Router from 'svelte-spa-router';

    import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';

    import fr from 'locales/fr.json';
    import en from 'locales/en.json';

    import Blockly from './routes/automation/Blockly.svelte';
    import Entities from './routes/entities/Entities.svelte';
    import Home from './routes/default/Home.svelte';
    import Automations from './routes/automation/Automations.svelte';
    import Entity from './routes/entities/Entity.svelte';

    import Navbar from './components/others/Navbar.svelte';
    import { socketManager } from './managers/socketManager';
    import Sidebar from './components/others/Sidebar.svelte';

    // Configure the app routes
    const routes = {
        '/entities/': Entities,
        '/entity/:id': Entity,
        '/home/': Home,
        '/blockly': Blockly,
        '/automations': Automations,
        // This is optional, but if present it must be the last
        '*': Home,
    };

    /* Open/Close sidebar from navbar */
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
    <div id="row1">
        <div class="header">
            <Navbar
                on:press={() => {
                    open = !open;
                }}
            />
        </div>
    </div>
    <div
        id="row2"
        class="flex flex-row space-x-4 sm:space-x-20 overflow-y-scroll h-screen"
    >
        <div class="sidenav fixed z-100">
            <Sidebar bind:open />
        </div>
        <div class="main-content mt-6 z-10">
            <Router {routes} />
        </div>
    </div>
</main>

<style lang="scss">
    :global(body) {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        background-color: #120639;
        color: white;
    }

    /* -------- SCROLLBAR -------- */

    /*Firefox*/
    #row2 {
        scrollbar-color: #c2d2e4 #4c4c4e;
        scrollbar-width: thin;
    }

    /* Chrome */
    #row2::-webkit-scrollbar {
        width: 0.25rem;
    }

    #row2::-webkit-scrollbar-track {
        background: #4c4c4e;
    }

    #row2::-webkit-scrollbar-thumb {
        background: #c2d2e4;
    }
</style>
