<script lang="ts">
    import * as SPA from 'svelte-spa-router';
    import { tr } from '../../utils/i18nHelper';
    import { clickOutside } from '../../utils/functions';

    export let open = false;
    let currentPageSelected = '';
    const pageLinkClicked = (currentPage: string) => {
        currentPageSelected = currentPage;
        open = false;
    };

    function handleClickOutside() {
        open = false;
    }
</script>

<nav
    class="navbar relative w-16 h-screen border-r-2 shadow-lg bg-gray-900"
    class:open
    use:clickOutside
    on:click_outside={handleClickOutside}
>
    <ul class="navbar-nav list-none p-0 m-0 flex flex-col items-center">
        <li class="nav_item">
            <a
                class="nav-link"
                href="/"
                use:SPA.link
                on:click={() => {
                    pageLinkClicked('home');
                }}
                class:selected={currentPageSelected === 'home' || currentPageSelected === ''}
            >
                <img
                    class="link-svg"
                    src="icons/sidebar/home.svg"
                    alt={tr('menu.home')}
                />
                <span class="link-text">{tr('menu.home')}</span>
            </a>
        </li>
        <li class="nav_item">
            <a
                href="/devices"
                class="nav-link"
                use:SPA.link
                on:click={() => {
                    pageLinkClicked('devices');
                }}
                class:selected={currentPageSelected === 'devices'}
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
                href="/blockly"
                class="nav-link"
                use:SPA.link
                on:click={() => {
                    pageLinkClicked('blockly');
                }}
                class:selected={currentPageSelected === 'blockly'}
            >
                <img
                    class="link-svg"
                    src="icons/sidebar/blockly.svg"
                    alt={tr('menu.blockly')}
                />
                <span class="link-text">{tr('menu.blockly')}</span>
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
        @apply ml-4 text-sm opacity-0;
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
