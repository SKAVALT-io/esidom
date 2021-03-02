<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { tr, format } from '../../utils/i18nHelper';
    import { step, reset } from './PairingStore.svelte';
    import BorderedButton from '../UI/buttons/BorderedButton.svelte';
    import CancelButton from '../UI/buttons/CancelButton.svelte';

    const dispatch = createEventDispatcher();

    /* Update the variable stored in order to change the view */
    function startPairing() {
        step.update(() => 'StartPairingPage');
    }
</script>

<div class="flex flex-col space-y-3 ml-10 mr-10 justify-center items-center">
    <p class="max-w-lg md:max-w-xl">
        {tr('pairing.instructions.welcome')}
        <br />
        {tr('pairing.instructions.advice')}
    </p>
    <ul class="list-disc max-w-sm md:max-w-lg">
        <li>{tr('pairing.instructions.advice1')}</li>
        <li>{tr('pairing.instructions.advice2')}</li>
    </ul>
    <p class="max-w-lg md:max-w-xl">
        {format(tr('pairing.instructions.ready'), tr('buttons.confirm'))}
    </p>
    <div class="flex flex-row space-x-4">
        <CancelButton
            on:click={() => {
                dispatch('cancel');
                reset();
            }}
        />
        <BorderedButton text={tr('buttons.confirm')} on:click={startPairing} />
    </div>
</div>
