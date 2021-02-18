<script>
    import { createEventDispatcher } from 'svelte';
    import LoadingAnimation from '../animations/LoadingAnimation.svelte';
    import CancelButton from '../UI/buttons/CancelButton.svelte';
    import { step, reset } from './PairingStore.svelte';

    const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col space-y-6 justify-center items-center">
    <p class="text-lg uppercase text-center">Veuillez appairer votre objet</p>
    <LoadingAnimation />
    <CancelButton
        on:click={() => {
            dispatch('cancel');
            reset();
        }}
    />
</div>
