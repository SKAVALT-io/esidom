<script>
    // eslint-disable-next-line import/prefer-default-export
    export let open = false;
</script>

<link
    rel="stylesheet"
    type="text/css"
    href="https://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css"
/>

<nav
    class="main-menu flex flex-wrap transform fixed bg-gray-900 h-screen w-14 overflow-auto ease-out opacity-100 z-30"
    class:open
>
    <div>
        <ul>
            <li>
                <a href="/#/">
                    <i class="fa fa-home" />
                    <span class="nav-text">Home</span>
                </a>
            </li>

            <li>
                <a href="/#/devices">
                    <i class="fa fa-user fa-lg" />
                    <span class="nav-text">Devices</span>
                </a>
            </li>

            <li>
                <a href="/#/todo">
                    <i class="fa fa-envelope-o fa-lg" />
                    <span class="nav-text">Contact</span>
                </a>
            </li>
        </ul>
    </div>
</nav>

<style>
    @media (max-width: 640px) {
        .main-menu {
            display: -webkit-inline-box !important;
            display: -ms-inline-flexbox !important;
            display: inline-flex !important;
        }
    }
    .main-menu,
    .open {
        -webkit-transition: width 0.2s linear;
        transition: width 0.2s linear;
        -webkit-transform: translateZ(0) scale(1, 1);
    }

    .fa {
        position: relative;
        display: table-cell;
        width: 60px;
        height: 36px;
        text-align: center;
        top: 5px;
        font-size: 24px;
    }

    .main-menu:hover,
    .open {
        width: 150px;
        opacity: 1;
    }

    .main-menu ul {
        margin: 10px 0;
    }

    .main-menu li > a {
        position: relative;
        width: 255px;
        display: table;
        border-collapse: collapse;
        border-spacing: 0;
        color: #ffffff;
        font-size: 13px;
    }

    a:hover,
    a:focus {
        text-decoration: none;
        border-left: 0px solid #f7f7f7;
    }

    nav ul,
    nav li {
        outline: 0;
        margin: 0;
        padding-bottom: 9px;
        text-transform: uppercase;
    }

    .main-menu li:hover > a,
    .no-touch .dashboard-page nav.dashboard-menu ul li:hover a,
    .dashboard-page nav.dashboard-menu ul li.active a {
        color: #fff;
        background-color: #505050;
    }
</style>
