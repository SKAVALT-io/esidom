<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import BorderedButton from '../UI/buttons/BorderedButton.svelte';
    import CancelButton from '../UI/buttons/CancelButton.svelte';
    import { tr } from '../../utils/i18nHelper';

    import { step, reset } from './PairingStore.svelte';
    import config from '../../config/config';

    const dispatch = createEventDispatcher();

    async function pair() {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        await fetch(`${config.BASE_URL}/device`, {
            headers,
            method: 'POST',
        }).then((x) => {
            console.log('LULUBULE ', x.status);
        });
    }

    async function startPairing() {
        step.update(() => 'StartPairingPage');
        await pair();
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
        {tr('pairing.instructions.ready')}
        <span
            class="text-blue-300 capitalize"
        >{tr('pairing.instructions.validate')}</span>
        {tr('pairing.instructions.start')}
    </p>
    <div class="flex flex-row space-x-4">
        <CancelButton
            on:click={() => {
                dispatch('cancel');
                reset();
            }}
        />
        <BorderedButton text="Valider" on:click={startPairing} />
    </div>
</div>
