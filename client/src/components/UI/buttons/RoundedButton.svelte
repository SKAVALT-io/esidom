<script>
    export let size = 11;
    export let iconPath = '';
    export let bgColor = 'bg-blue-500';
    export let bgColorHover = 'bg-blue-600';
</script>

<button
    on:click
    class="roundedButton inline-flex items-center justify-center p-2 w-{size} h-{size} text-white transition-colors duration-150 {bgColor} hover:{bgColorHover} rounded-full focus:shadow-outline"
>
    {#if iconPath === ''}
        <span><slot /></span>
    {:else}<img class="w-5 h-5" src={iconPath} alt="" />{/if}
</button>

<!-- Exemple of use
    <RoundedButton on:click={myFunction} iconPath="path/to/icon.svg" /> 
    or
    <RoundedButton on:click={myFunction}> <MyComponentSVG /> </RoundedButton>
-->
