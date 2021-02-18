<script>
    import { onDestroy } from 'svelte';
    import { tr } from '../../utils/i18nHelper';
    import InstructionPage from './InstructionsPage.svelte';
    import StartPairingPage from './StartPairingPage.svelte';
    import { step } from './PairingStore.svelte';
    import FailurePairingPage from './FailurePairingPage.svelte';
    import SuccessPairingPage from './SuccessPairingPage.svelte';

    // const steps = [
    //     '1_Request',
    //     '2_Start_Pairing',
    //     '3_Pairing_Success',
    //     '3b_Pairing_Fail',
    // ];

    let currentStep = '';

    const unsubscribe = step.subscribe((value) => {
        currentStep = value;
    });

    /* use to unsubscribe when the component is unmounted */
    onDestroy(unsubscribe);
</script>

<div
    id="page"
    class="flex absolute top-0 left-0 w-screen h-screen bg-white bg-opacity-30 justify-center items-center z-100"
>
    <div class="pairDevice ml-5 mr-5 py-3 w-full h-auto bg-esidom">
        <h1 class="uppercase mb-2 text-xl font-semibold text-center">
            {tr('menu.pairing')}
        </h1>
        {#if currentStep === 'InstructionPage'}
            <InstructionPage on:cancel />
        {:else if currentStep === 'StartPairingPage'}
            <StartPairingPage on:cancel />
        {:else if currentStep === 'SuccessPairingPage'}
            <SuccessPairingPage />
        {:else if currentStep === 'FailurePairingPage'}
            <FailurePairingPage on:cancel />
        {/if}
    </div>
</div>

<style>
    .pairDevice {
        min-height: 26%;
    }
</style>
