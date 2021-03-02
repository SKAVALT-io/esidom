<script>
    export let label = '';
    export let input = '';
    export let placeholder = '';
    export let required = false;
    export let width = 'full';
    export let submitted = false;
</script>

<div class="mb-3" class:submitted>
    {#if label.length !== 0}
        <label
            class="capitalize block text-grey-darker text-md font-bold mb-2 "
            for="title"
        >{label}
        </label>
    {/if}
    <div class="flex items-center">
        <slot />
        <input
            bind:value={input}
            type="text"
            class="px-2 py-2 pr-4 {`w-${width}`} placeholder-gray-400 text-gray-900 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline"
            {placeholder}
            {required}
        />
    </div>
</div>

<!-- Exemple of use            
    <InputBar
    label="test"
    bind:input={myVariable}
    placeholder="My Placeholder"
    required={true}
    width="56"
    /> 
-->
<style>
    .submitted input:invalid {
        border: 2px solid #c00;
    }
</style>
