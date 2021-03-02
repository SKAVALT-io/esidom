<script>
    import { onDestroy, SvelteComponent } from 'svelte';
    import type { SwitchEntity } from '../../../../types/entities/switchEntity';

    import { socketManager } from '../../../managers/socketManager';
    import SwitchService from '../../../services/entities/switchService';
    import EntityService, { getEntity } from '../../../services/entityService';
    import { tr } from '../../../utils/i18nHelper';
    import RoundedButton from '../../UI/buttons/RoundedButton.svelte';
    import ToggleButton from '../../UI/buttons/ToggleButton.svelte';
    import EditableDiv from '../../UI/utils/EditableDiv.svelte';

    export let entityId: string;
    let entity: SwitchEntity;
    let isOn = false;
    $: isOn = entity?.state === 'on';

    async function loadEntity() {
        entity = await getEntity<SwitchEntity>(entityId);
        console.log('binary sensor: ', entity);
    }

    function updateEntity(data: SwitchEntity) {
        console.log('new ws', data);
        entity = data;
    }

    socketManager.registerListenerById('entityUpdated', entityId, updateEntity);

    onDestroy(() => {
        socketManager.removeListener('entityUpdated', updateEntity);
    });

    async function changeName(e: CustomEvent<boolean>): Promise<void> {
        if (e.detail) {
            await EntityService.patchEntityName(entityId, entity.name);
        }
    }

    function switchEntity() {
        SwitchService.switchSwitch(entity.id, !isOn);
    }

    function triggerSwitch() {
        SwitchService.triggerSwitch(entity.id);
    }
</script>

{#await loadEntity()}
    {tr('entities.menu.loading')}
{:then l}
    <div>
        <div id="title">
            <h1 class="text-4xl text-center py-6">
                <EditableDiv
                    bind:value={entity.name}
                    placeholder={tr('entities.menu.enterEntityName')}
                    on:edition={changeName}
                />
            </h1>
        </div>

        <div id="content" class="flex flex-row justify-center">
            <div
                id="info"
                class="relative grid grid-cols-12 gap-4 py-4 uppercase bg-esidomlight w-full justify-center md:w-2/3 md:max-w-xl"
            >
                <div class="col-span-full text-center font-semibold text-xl">
                    Informations
                </div>

                <div class="col-span-3 row-start-2 text-right">
                    {tr('entities.menu.name')}
                </div>
                <div class="col-span-9 row-start-2">{entity.name}</div>
                <div class="col-span-3 row-start-3 text-right">
                    {tr('entities.menu.type')}
                </div>
                <div class="col-span-9 row-start-3">{entity.type}</div>

                {#if entity.attributes.last_run_success !== undefined}
                    <div class="col-span-3 row-start-4 text-right">
                        <RoundedButton
                            bgColor="bg-blue-500"
                            bgColorHover="bg-blue-500"
                            on:click={triggerSwitch}
                            size={9}
                            iconPath="/icons/button/trigger.svg"
                        />
                    </div>
                {:else}
                    <div class="col-span-3 row-start-4 text-right">
                        {tr('entities.menu.state')}
                    </div>
                    <div class="col-span-3 row-start-4">{entity.state}</div>
                    <div class="col-span-3 row-start-4">
                        <ToggleButton
                            on:change={switchEntity}
                            bind:checked={isOn}
                        />
                    </div>
                {/if}
            </div>
        </div>
    </div>
{:catch error}
    Error:
    {error}
{/await}
