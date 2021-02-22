<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { reset, Device } from './PairingStore.svelte';
    import { tr } from '../../utils/i18nHelper';
    import OutlineButton from '../UI/buttons/OutlineButton.svelte';

    const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col space-y-3 ml-10 mr-10 justify-center items-center">
    <p class="max-w-lg md:max-w-xl">
        Félicitation, votre appareil
        <span class="text-blue-300">{Device.data.model}</span>
        a bien été rajouté au sein de votre réseau.
    </p>
    <OutlineButton
        text="Fermer"
        on:click={() => {
            dispatch('cancel');
            reset();
        }}
    />
</div>
