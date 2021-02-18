<script>
    import { createEventDispatcher } from 'svelte';
    import { tr } from '../../utils/i18nHelper';
    import { step, reset } from './PairingStore.svelte';

    let deviceName = '';
</script>

<div class="flex flex-col space-y-4 ml-10 mr-10 justify-center items-center">
    <p class="max-w-lg md:max-w-xl">
        Equipement trouvé : TODO NOM EQUIPEMENT
        <br />
        Veuillez nommer votre équipement :
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
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900"
                id="username"
                type="text"
                placeholder="Nom de l'équipement"
            />
        </div>
        {deviceName}
    </div>
</div>
