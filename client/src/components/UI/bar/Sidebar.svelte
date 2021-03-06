<script lang="ts">
    import * as SPA from 'svelte-spa-router';
    import { tr } from '../../../utils/i18nHelper';
    import { clickOutside, getCurrentPage } from '../../../utils/functions';
    import UserService from '../../../services/userService';
    import type { User } from '../../../../types/userType';
    export let open = false;

    let currentPageSelected = getCurrentPage();
    window.onhashchange = () => {
        currentPageSelected = getCurrentPage();
    };

    const pageLinkClicked = (currentPage: string) => {
        currentPageSelected = currentPage;
        open = false;
    };

    function handleClickOutside(event: any) {
        // In the navbar file the humburger menu id is 'hamburger', pay attention to any changes!
        // console.log('event : ', event);
        if (event.detail.parentElement?.id !== 'hamburger') {
            open = false;
        }
    }

    let user: User | undefined = undefined;
    UserService.user.subscribe((newUser) => {
        user = newUser;
    });
</script>

<nav
    class="navbar relative w-16 h-screen border-r-2 shadow-lg bg-gray-900"
    class:open
    use:clickOutside
    on:click_outside={handleClickOutside}
>
    <ul
        class="navbar-nav list-none p-0 m-0 flex flex-col items-center capitalize"
    >
        <li class="nav_item">
            <a
                href="/entities"
                class="nav-link"
                use:SPA.link
                on:click={() => {
                    pageLinkClicked('entities');
                }}
                class:selected={currentPageSelected === 'entities'}
            >
                <img
                    class="link-svg"
                    src="icons/sidebar/devices.svg"
                    alt={tr('menu.devices')}
                />
                <span class="link-text">{tr('menu.devices')}</span>
            </a>
        </li>
        <li class="nav_item">
            <a
                href="/automations"
                class="nav-link"
                use:SPA.link
                on:click={() => {
                    pageLinkClicked('automations');
                }}
                class:selected={currentPageSelected === 'automations'}
            >
                <img
                    class="link-svg"
                    src="icons/sidebar/blockly.svg"
                    alt={tr('menu.automations')}
                />
                <span class="link-text">{tr('menu.automations')}</span>
            </a>
        </li>
        <li class="nav_item">
            <a
                href="/groups"
                class="nav-link"
                use:SPA.link
                on:click={() => {
                    pageLinkClicked('groups');
                }}
                class:selected={currentPageSelected === 'groups'}
            >
                <img
                    class="link-svg"
                    src="icons/sidebar/groups.svg"
                    alt={tr('menu.groups')}
                />
                <span class="link-text">{tr('menu.groups')}</span>
            </a>
        </li>
        <li class="nav_item">
            <a
                href="/rooms"
                class="nav-link"
                use:SPA.link
                on:click={() => {
                    pageLinkClicked('rooms');
                }}
                class:selected={currentPageSelected === 'rooms'}
            >
                <img
                    class="link-svg"
                    src="icons/sidebar/rooms.svg"
                    alt={tr('menu.rooms')}
                />
                <span class="link-text">{tr('menu.rooms')}</span>
            </a>
        </li>
        <li class="nav_item" class:invisible={!user?.admin}>
            <a
                href="/users"
                class="nav-link"
                use:SPA.link
                on:click={() => {
                    pageLinkClicked('users');
                }}
                class:selected={currentPageSelected === 'users'}
            >
                <img
                    class="link-svg"
                    src="icons/button/user.svg"
                    alt={tr('menu.users')}
                />
                <span class="link-text">{tr('menu.users')}</span>
            </a>
        </li>
    </ul>
</nav>

<style>
    a.selected {
        color: white;
        background-color: #505050;
    }

    /*nav*/
    .navbar {
        transition: width 300ms ease-in-out;
        width: 0px;
    }

    .open {
        @apply w-screen;
    }

    /*li*/
    .nav_item {
        @apply w-full;
    }

    /* a */
    .nav-link {
        @apply flex items-center h-12 no-underline duration-300;
    }

    .nav-link {
        filter: grayscale(100%) opacity(0.8);
    }

    .nav-link:hover {
        filter: grayscale(0%) opacity(1);
        color: white;
        background-color: #505050;
    }

    /* span */
    .link-text {
        @apply ml-4 text-sm opacity-0 cursor-default pointer-events-none;
    }

    .open .link-text {
        @apply opacity-100;
    }

    /* span */
    .link-svg {
        width: 1.4rem;
        margin: 0 0.7rem;
    }

    /* Large screens */
    @media only screen and (min-width: 640px) {
        .navbar,
        .open {
            @apply top-0 w-12 h-screen block;
        }

        .navbar:hover,
        .open {
            @apply w-full;
        }

        .navbar:hover .link-text,
        .open .link-text {
            @apply opacity-100 transition-opacity delay-150 mr-4;
        }
    }
</style>
