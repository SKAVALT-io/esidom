<script>
    import { tr } from '../../utils/i18nHelper';
    import { step, Device } from './PairingStore.svelte';
    import BorderedButton from '../UI/buttons/BorderedButton.svelte';

    const isValidInput = false;

    // function validateName() {
    //     if (deviceName.length === 0) {
    //         // TODO CHECK IF THE NAME HAS ALREADY REGISTERED
    //         isValidInput = false;
    //     }
    //     isValidInput = true;
    // }

    function finish() {
        step.update(() => 'FinishPairingPage');
    }
</script>

<div class="flex flex-col space-y-4 ml-10 mr-10 justify-center items-center">
    <p class="max-w-lg md:max-w-xl">
        Equipement trouvé :
        {Device.data.model}
        <br />
        Veuillez nommer votre équipement :
        <br />
        <br />
        <!--TODO CHANGE THIS -->
    </p>
    <!-- <div class="shadow-sm space-y-px ">
        <div class="mb-4">
            <label
                class="block text-grey-darker text-md font-bold mb-2"
                for="username"
            >
                Nom de l'équipement
            </label>
            <input
                bind:value={deviceName}
                on:input={validateName}
                required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900"
                id="username"
                type="text"
                placeholder="Nom de l'équipement"
            />
        </div>
    </div> -->
    <div class="flex flex-row space-x-4">
        <BorderedButton text="Finish" on:click={finish} />
    </div>
</div>
