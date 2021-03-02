<script>
    import { onDestroy, onMount } from 'svelte';
    import type { SwitchEntity } from '../../../../types/entities/switchEntity';

    import { socketManager } from '../../../managers/socketManager';
    import SwitchService from '../../../services/entities/switchService';
    import { tr } from '../../../utils/i18nHelper';
    import RoundedButton from '../../UI/buttons/RoundedButton.svelte';

    import EntityPreview from '../EntityPreview.svelte';

    export let entity: SwitchEntity;

    // Is it on or off
    let isOn: boolean;
    // The src for the icon
    let srcImg = 'devices/switch.png';
    $: isOn = entity.state === 'on';

    function updateState(data: SwitchEntity) {
        console.log('new ws', data);
        entity = data;
    }

    function switchEntity() {
        SwitchService.switchSwitch(entity.id, !isOn);
    }

    function triggerSwitch() {
        SwitchService.triggerSwitch(entity.id);
    }

    onMount(() => {
        socketManager.registerListenerById(
            'entityUpdated',
            entity.id,
            updateState
        );
    });

    onDestroy(() => {
        socketManager.removeListener('entityUpdated', updateState);
    });
</script>

<EntityPreview isError={false} {entity}>
    <!-- Image -->
    <div slot="img" class="w-full h-full flex items-center justify-center">
        <img
            src={srcImg}
            alt=""
            on:click={switchEntity}
            class="cursor-pointer h-3/4"
            class:row-span-3={isOn}
            class:row-span-5={!isOn}
        />
        {#if isOn}
            <div class="h-1/4">
                <img
                    src="icons/button/trigger.svg"
                    alt="Is on"
                    class="h-6 w-6"
                />
            </div>
        {/if}
    </div>
    <!-- Data -->
    <div slot="sensor">
        {#if entity.attributes.last_run_success === undefined}
            {tr('devices.state')}
            :
            {entity.state}
        {:else}
            <RoundedButton
                bgColor="bg-blue-500"
                bgColorHover="bg-blue-500"
                on:click={triggerSwitch}
                size={9}
                iconPath="/icons/button/trigger.svg"
            />
        {/if}
    </div>
</EntityPreview>
