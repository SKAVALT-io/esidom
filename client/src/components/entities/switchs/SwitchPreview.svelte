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
    <img
        slot="img"
        src={srcImg}
        on:click={switchEntity}
        alt=""
        class="h-inherit max-w-full max-h-full object-contain"
    />
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
