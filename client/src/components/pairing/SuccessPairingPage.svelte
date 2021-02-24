<script>
    import { tr } from '../../utils/i18nHelper';
    import { step, DeviceFound } from './PairingStore.svelte';
    import BorderedButton from '../UI/buttons/BorderedButton.svelte';
    import EntityService from '../../services/entityService';

    const { entities } = DeviceFound.data;
    let prefix = '';
    let submitted = false;

    const entitiesNames = entities.map((entityId) => ({
        id: entityId,
        newName: '',
    }));

    function switchPage() {
        step.update(() => 'FinishPairingPage');
    }

    function changeName() {
        submitted = true;
        if (prefix.length !== 0) {
            entitiesNames.forEach(async (entity) => {
                if (entity.newName.length !== 0) {
                    await EntityService.patchEntityName(
                        entity.id,
                        `${prefix}_${entity.newName}`.replace(/ /g, '_')
                    );
                }
            });
            // It's a trick to wait for the name changes to be taken into consideration
            setTimeout(switchPage, 300);
        }
    }
</script>

<div class="flex flex-col space-y-4 ml-10 mr-10 justify-center items-center">
    <p class="max-w-lg md:max-w-xl">
        <span class="text-blue-300"> {entities.length} </span>
        {tr('pairing.success.deviceFound')}
        <br />
        {tr('pairing.success.deviceName')}
        <br />
        {tr('pairing.success.warning')}
    </p>
    <div
        class="form-container p-5 rounded-lg max-h-80 w-full max-w-lg md:max-w-xl overflow-y-auto"
    >
        <form class="mb-8" class:submitted>
            <div class="form-group">
                <label
                    class="block text-grey-darker text-md font-bold mb-2 "
                    for="name"
                >Prefix (obligatoire)
                </label>
                <input
                    bind:value={prefix}
                    class="form-control shadow appearance-none border rounded w-52 py-2 px-3 text-gray-900"
                    type="text"
                    placeholder="Prefix de l'équipement"
                    required
                />
            </div>
        </form>
        {#each entitiesNames as { id, newName }}
            <div class="mb-4">
                <label
                    class="block text-grey-darker text-md font-bold mb-2 "
                    for="name"
                >
                    {id}</label>
                <div class="flex items-center">
                    <span
                        class="text-blue-300"
                    >{prefix.replace(/ /g, '_')}_</span>
                    <input
                        bind:value={newName}
                        class="flex-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-900"
                        type="text"
                        placeholder={id}
                    />
                </div>
            </div>
        {/each}
    </div>
    <div class="flex flex-row space-x-4">
        <BorderedButton text="Valider" on:click={changeName} />
    </div>
</div>

<style>
    .form-container {
        background-color: #22164d;
    }

    .form-control {
        border-radius: 3px;
    }

    .submitted input:invalid {
        border: 2px solid #c00;
    }

    .submitted input:focus:invalid {
        outline: 1px solid #c00;
    }
</style>
