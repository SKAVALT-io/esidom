<script>
    import { onDestroy } from 'svelte';
    import { tr } from '../../utils/i18nHelper';
    import { step } from './PairingStore.svelte';
    import InstructionsPage from './InstructionsPage.svelte';
    import StartPairingPage from './StartPairingPage.svelte';
    import FailurePairingPage from './FailurePairingPage.svelte';
    import SuccessPairingPage from './SuccessPairingPage.svelte';
    import FinishPairingPage from './FinishPairingPage.svelte';

    /*map which associates a component with a string*/
    const steps = new Map([
        ['InstructionPage', InstructionsPage],
        ['StartPairingPage', StartPairingPage],
        ['SuccessPairingPage', SuccessPairingPage],
        ['FailurePairingPage', FailurePairingPage],
        ['FinishPairingPage', FinishPairingPage],
    ]);

    /*Current component view*/
    let viewportComponent: unknown;
    let currentStep = '';

    function updateViewportComponent() {
        viewportComponent = steps.get(currentStep);
    }

    /*subscription to the stored variable / updated view at each step change*/
    const unsubscribe = step.subscribe((value) => {
        currentStep = value;
        updateViewportComponent();
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
        <div id="viewport" on:outroend={updateViewportComponent}>
            <svelte:component this={viewportComponent} on:cancel />
        </div>
    </div>
</div>

<style>
    .pairDevice {
        min-height: 26%;
    }
</style>
