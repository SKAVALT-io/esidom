<script>
    import { createEventDispatcher, onMount, onDestroy } from 'svelte';
    import LoadingAnimation from '../animations/LoadingAnimation.svelte';
    import CancelButton from '../UI/buttons/CancelButton.svelte';
    import { step, reset } from './PairingStore.svelte';

    import { socketManager } from '../../managers/socketManager';

    const dispatch = createEventDispatcher();

    let timeout: NodeJS.Timeout;

    function failureDevicePaired() {
        step.update(() => 'FailurePairingPage');
    }

    // It's a hack, to wait for the end of the home assistant configuration
    function configurationDevicePaired() {
        timeout = setTimeout(failureDevicePaired, 10000);
    }

    function successDevicePaired(data) {
        console.log('M.....', data);
        step.update(() => 'SuccessPairingPage');
    }

    onMount(() => {
        socketManager.registerPairListener(
            'device_created',
            successDevicePaired
        );
        // Wait 60s an object was paired otherwise we go into the failure page
        timeout = setTimeout(configurationDevicePaired, 50000);
    });

    onDestroy(() => {
        clearTimeout(timeout);
        socketManager.removeListener('device_created', successDevicePaired);
    });
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
