<script>
    import { tr } from '../../utils/i18nHelper';
    import OutlineButton from '../UI/buttons/OutlineButton.svelte';
    import { step, reset } from './PairingStore.svelte';

    let deviceName = '';

    let isValidInput = false;

    function validateName() {
        if (deviceName.length === 0) {
            // TODO CHECK IF THE NAME HAS ALREADY REGISTERED
            isValidInput = false;
        }
        isValidInput = true;
    }
</script>

<div class="flex flex-col space-y-4 ml-10 mr-10 justify-center items-center">
    <p class="max-w-lg md:max-w-xl">
        Equipement trouvé : TODO NOM EQUIPEMENT
        <br />
        Veuillez nommer votre équipement :
        <br />
        <br />
        <!--TODO CHANGE THIS -->
    </p>
    <div class="shadow-sm space-y-px ">
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
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900"
                id="username"
                type="text"
                placeholder="Nom de l'équipement"
            />
        </div>
    </div>
    <button class="bg-white text-black" disabled={isValidInput}>Ok, I'm ready!</button>
</div>
