<script>
    import StartPairing from './StartPairing.svelte';

    export let currentStep = '';
    export let step = '';
</script>

<h1>YOUHOUUUUUU {step}</h1>
<button
    on:click={() => {
        currentStep = 'StartPairing';
    }}
    class:currentStep
/>
