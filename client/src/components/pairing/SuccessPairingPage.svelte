<script>
    import { tr, format } from '../../utils/i18nHelper';
    import { step, DeviceFound } from './PairingStore.svelte';
    import BorderedButton from '../UI/buttons/BorderedButton.svelte';
    import EntityService from '../../services/entityService';
    import InputBar from '../UI/bar/InputBar.svelte';

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
                        `${prefix} ${entity.newName}`
                    );
                }
            });
            // It's a trick to wait for the name changes to be taken into consideration
            setTimeout(switchPage, 300);
        }
    }
</script>

<div class="flex flex-col space-y-4 ml-10 mr-10 justify-center items-center">
    <p class="max-w-lg md:max-w-2xl">
        {format(tr('pairing.success.deviceFound'), DeviceFound.data.model)}
        <br />
        {format(tr('pairing.success.entitiesAttached'), `${entities.length}`)}
        <br />
        {tr('pairing.success.instructions')}
    </p>
    <div
        class="container p-5 rounded-lg max-h-80 w-full max-w-lg md:max-w-2xl overflow-y-auto"
    >
        <form class="form-control mb-8">
            <InputBar
                label={tr('pairing.success.prefix')}
                bind:input={prefix}
                bind:submitted
                placeholder={tr('pairing.success.prefixPlaceholder')}
                required={true}
                width="56"
            />
        </form>
        {#each entitiesNames as { id, newName }, i}
            <div class="mb-4">
                <InputBar
                    label={format(tr('pairing.success.entity'), `${i + 1}`)}
                    bind:input={newName}
                    placeholder={id}
                >
                    <span class="text-blue-300 mr-2">{prefix}</span>
                </InputBar>
            </div>
        {/each}
    </div>
    <div class="flex flex-row space-x-4">
        <BorderedButton text={tr('buttons.confirm')} on:click={changeName} />
    </div>
</div>

<style>
    .container {
        background-color: #22164d;
    }
</style>
