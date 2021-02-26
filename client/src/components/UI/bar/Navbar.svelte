<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import Clock from '../../others/Clock.svelte';
    import { tr } from '../../../utils/i18nHelper';
    import AccountSvg from '../../svg_icons/AccountSVG.svelte';
    import RoundedButton from '../buttons/RoundedButton.svelte';
    import UserService from '../../../services/userService';
    import type { User } from '../../../../types/userType';

    const dispatch = createEventDispatcher();

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
            <p>{tr('app.name')}</p>
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
    <div class="nav-links grid grid-flow-col grid-cols-2 gap-x-2 items-center">
        <button id="logout" on:click={() => dispatch('disconnect')}>
            <img
                class="link-svg w-5 h-5 opacity-80 hover:opacity-100"
                src="icons/navbar/logout.svg"
                alt="logout"
            />
        </button>
        <div>
            {#if user}
                <i>{user.username}</i>
            {:else}
                <p>{tr('user.notConnected')}</p>
            {/if}
        </div>
        <button
            id="login"
            on:click={() => dispatch('login')}
            href="/#/"
            class="lg:inline-flex lg:w-auto w-full py-2 rounded text-gray-400 items-center justify-center hover:bg-gray-900 hover:text-white"
        >
            <AccountSvg />
        </button>
    </div>
</nav>

<style>
</style>
