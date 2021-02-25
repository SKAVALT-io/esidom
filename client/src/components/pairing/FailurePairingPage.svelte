<script>
    import { createEventDispatcher } from 'svelte';
    import { tr } from '../../utils/i18nHelper';
    import { step, reset } from './PairingStore.svelte';
    import BorderedButton from '../UI/buttons/BorderedButton.svelte';
    import CancelButton from '../UI/buttons/CancelButton.svelte';

    const dispatch = createEventDispatcher();

    function retry() {
        step.update(() => 'StartPairingPage');
    }
</script>

<div class="flex flex-col space-y-3 ml-10 mr-10 justify-center items-center">
    <p class="max-w-lg md:max-w-xl">
        {tr('pairing.failure.deviceNotFound')}
        <br />
        {tr('pairing.failure.followInstructions')}
        <br />
        <br />
        {tr('pairing.failure.retryPairingProcedure')}
        <span
            class="text-blue-300 capitalize"
        >{tr('pairing.failure.retry')}</span>
    </p>
    <div class="flex flex-row space-x-4">
        <CancelButton
            on:click={() => {
                dispatch('cancel');
                reset();
            }}
        />
        <BorderedButton text={tr('buttons.retry')} on:click={retry} />
    </div>
</div>
