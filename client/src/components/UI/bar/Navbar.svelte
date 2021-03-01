<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import Clock from '../../others/Clock.svelte';
    import { tr } from '../../../utils/i18nHelper';
    import UserService from '../../../services/userService';
    import type { User } from '../../../../types/userType';
    import Tooltip from '../utils/Tooltip.svelte';

    const dispatch = createEventDispatcher();

    let showLogoutTip = false;
    let showChangeUserTip = false;
    let user: User | undefined = undefined;
    UserService.user.subscribe((newUser) => {
        user = newUser;
    });
</script>

<nav
    class="top-navbar flex flex-wrap w-full items-center justify-between px-2 h-full bg-gray-900 text-white border-b border-gray-100 z-10"
>
    <div class="flex items-center">
        <button id="hamburger" class="mr-2" on:click={() => dispatch('press')}>
            <img
                class="link-svg opacity-80 hover:opacity-100"
                src="icons/navbar/hamburger_menu.svg"
                alt="hamburger_menu"
            />
        </button>

        <a href="/#/" class="contents">
            <img src="logo-esidom.png" alt="ESIDOM" class="logo h-auto w-12" />
            <p class="hidden sm:flex">{tr('app.name')}</p>
        </a>
    </div>
    <div class="text-lg">
        <p class="sm:hidden">
            <Clock formatDate="short" />
        </p>
        <p class="hidden sm:flex">
            <Clock formatDate="long" />
        </p>
    </div>
    <div class="nav-links grid grid-flow-col grid-cols-1 gap-x-2 items-center">
        <button
            id="logout"
            class="relative w-5 h-5 opacity-80 hover:opacity-100"
            on:click={() => dispatch('disconnect')}
            on:touchstart={() => (showLogoutTip = true)}
            on:touchend={() => (showLogoutTip = false)}
            on:mouseleave={() => (showLogoutTip = false)}
            on:mouseenter={() => (showLogoutTip = true)}
        >
            <img
                class="link-svg w-5 h-5 opacity-80 hover:opacity-100"
                src="icons/navbar/logout.svg"
                alt="logout"
            />
            <Tooltip
                position="bottom"
                show={showLogoutTip}
                text={tr('user.logout')}
            />
        </button>

        <button
            id="login"
            on:click={() => dispatch('login')}
            href="/#/"
            class="relative lg:inline-flex lg:w-auto w-full py-2 rounded text-gray-400 items-center space-x-4 hover:bg-gray-900 hover:text-white"
            on:touchstart={() => (showChangeUserTip = true)}
            on:touchend={() => (showChangeUserTip = false)}
            on:mouseleave={() => (showChangeUserTip = false)}
            on:mouseenter={() => (showChangeUserTip = true)}
        >
            <div>
                {#if user}
                    <i class="capitalize">{user.username}</i>
                {:else}
                    <p>{tr('user.notConnected')}</p>
                {/if}
            </div>
            <img
                class="link-svg w-5 h-5 opacity-80 hover:opacity-100"
                src="icons/button/user.svg"
                alt="changeUser"
            />
            <Tooltip
                position="left"
                show={showChangeUserTip}
                text={tr('user.changeUser')}
            />
        </button>
    </div>
</nav>

<style>
</style>
