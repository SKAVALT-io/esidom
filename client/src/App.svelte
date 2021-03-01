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

    import Navbar from './components/UI/bar/Navbar.svelte';
    import { socketManager } from './managers/socketManager';
    import Sidebar from './components/UI/bar/Sidebar.svelte';
    import Toast from './Toast.svelte';
    import Groups from './routes/groups/Groups.svelte';
    import Users from './routes/users/Users.svelte';
    import UserService from './services/userService';
    import LoginPage from './components/login/LoginPage.svelte';
    import DisconnectModal from './components/login/DisconnectModal.svelte';
    import Rooms from './routes/room/Rooms.svelte';
    import HelpModal from './components/help/HelpModal.svelte';
    import { tr, trArray } from './utils/i18nHelper';
    import LoginModal from './components/login/LoginModal.svelte';

    // Configure the app routes
    const routes = {
        '/entities/': Entities,
        '/entity/:id': Entity,
        '/blockly': Blockly,
        '/blockly/:id': Blockly,
        '/automations': Automations,
        '/groups': Groups,
        '/rooms': Rooms,
        '/users': Users,
        // This is optional, but if present it must be the last
        '*': Entities,
    };

    /* Open/Close sidebar from navbar */
    let openSidebar = false;

    let openDisconnectModal = false;
    let openHelpModal = false;

    function hashToPage() {
        const sub = window.location.hash.substring(2);
        // handle only two levels of hash page
        // it is not generic and is really specific to our project
        if (sub.includes('/')) {
            const newSub = sub.replace('/', '.');
            const split = newSub.split('.');
            const knownList = ['light', 'switch']; // ex : entity.light

            return knownList.includes(split[1])
                ? `${split[0]}.${split[1]}`
                : `${split[0]}.default`;
        }
        return sub !== '' ? sub : 'entities';
    }

    let currentPageSelected = hashToPage();
    let openLoginModal = false;

    // Configure and init i18n
    addMessages('fr', fr);
    addMessages('en', en);

    init({
        fallbackLocale: 'fr',
        initialLocale: getLocaleFromNavigator(),
    });

    // Initiate the socket
    socketManager.connect();

    async function isLocked(): Promise<boolean> {
        return UserService.isLocked();
    }
</script>

<main>
    <Toast />
    <DisconnectModal bind:open={openDisconnectModal} />
    <HelpModal
        bind:open={openHelpModal}
        helpText={trArray(`help.${currentPageSelected}`)}
    />
    <LoginModal bind:open={openLoginModal} />

    {#await isLocked() then locked}
        {#if locked}
            <LoginPage />
        {:else}
            <div id="row1">
                <div class="header">
                    <Navbar
                        on:press={() => {
                            openSidebar = !openSidebar;
                        }}
                        on:disconnect={() => (openDisconnectModal = true)}
                        on:help={() => {
                            currentPageSelected = hashToPage();
                            openHelpModal = true;
                        }}
                        on:login={() => (openLoginModal = true)}
                    />
                </div>
            </div>
            <div
                id="row2"
                class="flex flex-row space-x-4 sm:space-x-20 overflow-y-auto h-screen"
            >
                <div class="sidenav fixed z-110">
                    <Sidebar bind:open={openSidebar} />
                </div>
                <div class="main-content w-full mt-6">
                    <Router {routes} />
                </div>
            </div>
        {/if}
    {/await}
</main>

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
