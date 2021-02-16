<script lang="ts">
    import Router from 'svelte-spa-router';

    import Blockly from './routes/automation/Blockly.svelte';
    import Devices from './routes/devices/Devices.svelte';
    import Home from './routes/default/Home.svelte';

    import Navbar from './components/others/Navbar.svelte';
    import { socketManager } from './managers/socketManager';
    import Sidebar from './components/others/Sidebar.svelte';

    const routes = {
        '/devices/': Devices,
        '/home/': Home,
        '/blockly': Blockly,
        // This is optional, but if present it must be the last
        '*': Home,
    };

    /* Open/Close sidebar from navbar */
    let open = false;

    // Initiate the socket
    socketManager.connect();
</script>

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
    <div class="sidenav fixed">
        <Sidebar bind:open />
    </div>
    <main class="main-content mt-6">
        <Router {routes} />
    </main>
</div>

<style lang="scss">
    :global(body) {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        background-color: #120639;
        color: white;
        overflow: hidden;
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
