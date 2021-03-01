<script>
    import { onDestroy, onMount } from 'svelte';
    import type { SwitchEntity } from '../../../../types/entities/switchEntity';

    import { socketManager } from '../../../managers/socketManager';
    import { tr } from '../../../utils/i18nHelper';
    import AccountSvg from '../../svg_icons/AccountSVG.svelte';

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
    <div id="img" slot="img">
        <img
            src={srcImg}
            alt=""
            class="h-inherit max-w-full max-h-full object-contain"
        />
        {#if isOn}
            <img src="icons/button/trigger.svg" alt="Is on" class="h-6 w-6" />
        {/if}
    </div>
    <!-- Data -->
    <div slot="sensor">{tr('devices.state')} : {entity.state}</div>
</EntityPreview>
