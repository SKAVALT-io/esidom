<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import { reset, DeviceFound } from './PairingStore.svelte';
    import { tr } from '../../utils/i18nHelper';
    import OutlineButton from '../UI/buttons/OutlineButton.svelte';
    import { getEntity } from '../../services/entityService';

    const dispatch = createEventDispatcher();
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
    <p class="max-w-lg md:max-w-xl">
        {tr('pairing.finish.congratulation')}
        {#each entitiesNames as entity}
            <span
                class="flex flex-col justify-center text-center text-blue-300"
            >
                {entity}
            </span>
        {/each}
        {tr('pairing.finish.congratulationFollowing')}
    </p>
    <OutlineButton
        text="Fermer"
        on:click={() => {
            dispatch('cancel');
            reset();
        }}
    />
</div>
