<script lang="ts">
    export let open = false;

    let currentPageSelected = '';
    // $: currentPageSelected = (() => {
    //     const b = window.location.hash.split('/');
    //     console.log(b);
    //     return b[1];
    // })();

    const pageLinkClicked = (currentPage: string) => {
        currentPageSelected = currentPage;
        open = false;
    };

    // onMount(() => {
    //     window.onhashchange = () => {
    //         [, currentPageSelected] = window.location.hash.split('/');
    //     };
    // });
</script>

<!-- TODO Change this -->
<link
    rel="stylesheet"
    type="text/css"
    href="https://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css"
/>

<nav
    class="main-menu bg-gray-900 absolute sm:relative w-full h-screen z-100 transition overflow-hidden"
    class:open
>
    <div class="navigation absolute -top-0 -left-0 w-full">
        <a
            class="home-link"
            href="/#/"
            on:click={() => {
                pageLinkClicked('home');
            }}
            class:selected={currentPageSelected === 'home' || currentPageSelected === ''}
        >
            <span class="icon"><i class="fa fa-home" /></span>
            <span class="title">Home</span>
        </a>
        <a
            class="devices-link"
            href="/#/devices"
            on:click={() => {
                pageLinkClicked('devices');
            }}
            class:selected={currentPageSelected === 'devices'}
        >
            <span class="icon"><i class="fa fa-user" /></span>
            <span class="title">Devices</span>
        </a>
        <a
            href="/#/"
            on:click={() => {
                pageLinkClicked('todo');
            }}
            class:selected={currentPageSelected === 'todo'}
        >
            <span class="icon"><i class="fa fa-envelope-o" /></span>
            <span class="title">Todo</span>
        </a>
        <a
            href="/#/blockly"
            on:click={() => {
                pageLinkClicked('blockly');
            }}
            class:selected={currentPageSelected === 'blockly'}
        >
            <span class="icon"><i class="fa fa-cogs" /></span>
            <span class="title">Blockly</span>
        </a>
    </div>
</nav>

<style>
    .main-menu,
    .open:active {
        transition: 0.3s;
    }

    .main-menu:hover,
    .open {
        width: 300px;
    }

    a {
        position: relative;
        display: flex;
        width: 100%;
        text-decoration: none;
        color: white;
    }

    .icon {
        position: relative;
        display: block;
        min-width: 60px;
        height: 60px;
        line-height: 60px;
        text-align: center;
    }

    .fa {
        font-size: 24px;
    }

    .title {
        position: relative;
        display: block;
        padding: 0 10px;
        height: 60px;
        line-height: 60px;
        text-align: start;
        white-space: nowrap;
        text-transform: uppercase;
    }

    a:hover,
    a.selected {
        color: white;
        background-color: #505050;
    }

    /* Change this by tailwind components (media max-width doesn't exist in tailwind, find another way)*/
    @media (max-width: 640px) {
        .main-menu {
            left: -70px;
        }

        .main-menu:hover {
            width: 100%;
        }

        .open {
            left: 0px;
            width: 100%;
        }
    }
</style>
