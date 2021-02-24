<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import { reset, DeviceFound } from './PairingStore.svelte';
    import { tr } from '../../utils/i18nHelper';
    import OutlineButton from '../UI/buttons/OutlineButton.svelte';
    import { getEntity } from '../../services/entityService';

    const dispatch = createEventDispatcher();
    // eslint-disable-next-line ParseError
    let entitiesNames: string[] = [];

    onMount(() => {
        const { entities } = DeviceFound.data;
        entities.forEach(
            async (entity) =>
                await getEntity(entity).then(
                    (x) => (entitiesNames = [...entitiesNames, x.name])
                )
        );
    });

    console.log(entitiesNames);
</script>

<div class="flex flex-col space-y-3 ml-10 mr-10 justify-center items-center">
    <p class="max-w-xl md:max-w-2xl">{tr('pairing.finish.congratulation')}</p>
    <div
        class="max-w-xl md:max-w-2xl grid grid-cols-1 gap-2 justify-center text-center"
    >
        {#each entitiesNames as entity}
            <span class="text-lg text-blue-300">{entity} </span>
        {/each}
    </div>

    <OutlineButton
        text="Fermer"
        on:click={() => {
            dispatch('cancel');
            reset();
        }}
    />
</div>
