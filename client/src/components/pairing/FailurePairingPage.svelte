<script>
    import { createEventDispatcher } from 'svelte';
    import { tr } from '../../utils/i18nHelper';
    import BorderedButton from '../UI/buttons/BorderedButton.svelte';
    import CancelButton from '../UI/buttons/CancelButton.svelte';
    import { step, reset } from './PairingStore.svelte';

    const dispatch = createEventDispatcher();

    function retry() {
        step.update(() => 'StartPairingPage');
    }
</script>

<div class="flex flex-col space-y-3 ml-10 mr-10 justify-center items-center">
    <p class="max-w-lg md:max-w-xl">
        Nous n'avons pas trouvé votre équipement 😟
        <br />
        Assurez-vous d'avoir bien suivi les étapes d'appairage de votre
        équipement.
        <br />
        <br />
        Pour relancer la procédure d'appairge, cliquez sur le bouton
        <span class="text-blue-300 capitalize">Réassayer</span>
    </p>
    <div class="flex flex-row space-x-4">
        <CancelButton
            on:click={() => {
                dispatch('cancel');
                reset();
            }}
        />
        <BorderedButton text="Réassayer" on:click={retry} />
    </div>
</div>
