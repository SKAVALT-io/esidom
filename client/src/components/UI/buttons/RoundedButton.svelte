<script>
    export let size = 11;
    export let iconPath = '';
</script>

<button
    on:click
    class="roundedButton inline-flex items-center justify-center p-2 {`w-${size}`} {`h-${size}`} text-white transition-colors duration-150 bg-blue-500 rounded-full focus:shadow-outline hover:bg-blue-600"
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
