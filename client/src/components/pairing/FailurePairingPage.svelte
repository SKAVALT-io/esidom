<script>
    import { onDestroy, onMount, createEventDispatcher } from 'svelte';
    import { tr } from '../../utils/i18nHelper';
    import { step, protocols, reset } from './PairingStore.svelte';
    import BorderedButton from '../UI/buttons/BorderedButton.svelte';
    import CancelButton from '../UI/buttons/CancelButton.svelte';
    import type { Protocols, Status } from '../../../types/protocols';

    const dispatch = createEventDispatcher();

    function retry() {
        step.update(() => 'StartPairingPage');
    }

    let protocolsFailed: Protocols;
    let toto: Array<{ name: string; status: Status }>;

    /* subscription to the stored variable */
    const unsubscribe = protocols.subscribe((value) => {
        protocolsFailed = value;
        toto = Object.keys(protocolsFailed)
            .map((key) => ({ name: key, status: protocolsFailed[key] }))
            .filter((protocol) => protocol.status.status === 'failed');
    });

    /* use to unsubscribe when the component is unmounted */
    onDestroy(unsubscribe);
</script>

<div class="flex flex-col space-y-3 ml-10 mr-10 justify-center items-center">
    <p class="max-w-lg md:max-w-xl">
        {tr('pairing.failure.deviceNotFound')}
        <br />
        {tr('pairing.failure.followInstructions')}
        <br />
        <br />
        Les protocoles suivants ont échoués :
        <br />
        <span class="text-red-500">
            {#if toto}
                {#each toto as n}{n.name + ' : ' + n.status.error} <br />{/each}
            {/if}
        </span>

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
