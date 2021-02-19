<script>
    export let title = 'Title';
    export let iconPath = '';
</script>

<div id="deviceContainer" class="flex flex-col">
    <div
        id="title"
        class="h-auto w-max rounded-t-lg inline-flex items-center pr-3 pl-3 space-x-3"
    >
        <img class="h-5 w-auto" src={iconPath} alt="icon" />
        <h1 class="text-white">{title}</h1>
    </div>
    <div
        id="items"
        class="grid md:grid-cols-4 gap-x-5 gap-y-5 p-5 rounded-r-lg max-w-screen-lg"
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
