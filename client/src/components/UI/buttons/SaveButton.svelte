<script>
    import BorderedButton from './BorderedButton.svelte';

    export let isDisabled = false;
</script>

<BorderedButton text="Sauvegarder" on:click bind:isDisabled />
