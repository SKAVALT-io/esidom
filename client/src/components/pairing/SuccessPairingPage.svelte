<script>
    import { tr } from '../../utils/i18nHelper';
    import { step, DeviceFound } from './PairingStore.svelte';
    import BorderedButton from '../UI/buttons/BorderedButton.svelte';
    import EntityService from '../../services/entityService';

    // TODO CHECK IF THE NAME HAS ALREADY REGISTERED
    const { entities } = DeviceFound.data;

    const entitiesNames = entities.map((entityId) => ({
        id: entityId,
        newName: '',
    }));

    function changeName() {
        entitiesNames.forEach(async (entity) => {
            if (entity.newName.length !== 0) {
                EntityService.patchEntityName(entity.id, entity.newName);
            }
        });
        step.update(() => 'FinishPairingPage');
    }
</script>

<div class="flex flex-col space-y-4 ml-10 mr-10 justify-center items-center">
    <p class="max-w-lg md:max-w-xl">
        {tr('pairing.success.deviceFound')}
        <br />
        {tr('pairing.success.deviceName')}
    </p>
    <div class="max-h-64 w-max overflow-y-auto">
        {#each entitiesNames as { id, newName }}
            <div class="">
                <label
                    class="block text-grey-darker text-md font-bold mb-2 "
                    for="name"
                >
                    {id}</label>
                <input
                    bind:value={newName}
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900"
                    type="text"
                    placeholder={id}
                />
            </div>
        {/each}
    </div>
    <div class="flex flex-row space-x-4">
        <BorderedButton text="Validate" on:click={changeName} />
    </div>
</div>
