<script>
    export let title = 'Title';
    export let iconPath = '';
</script>

<div id="deviceContainer" class="flex flex-col">
    <div
        id="title"
        class="h-auto w-max rounded-t-lg inline-flex items-center px-3 pt-2 space-x-3"
    >
        <img class="h-5 w-auto" src={iconPath} alt="icon" />
        <h1 class="text-white">{title}</h1>
    </div>
    <div
        id="items"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-6 p-5 rounded-r-lg max-w-screen-2xl"
    >
        <slot />
    </div>
</div>

<!-- Exemple of use : 
<DeviceContainer title="Lampes" iconPath="favicon.png">
    <Device />
    <Device />
    <Device />
    <Device />
    <Device />
</DeviceContainer>
-->
<style>
    #deviceContainer > #title {
        background-color: #22164d;
    }

    #deviceContainer > #items {
        background-color: #22164d;
    }
</style>
