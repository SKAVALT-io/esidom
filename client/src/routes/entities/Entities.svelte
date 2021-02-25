<script lang="ts">
    import type { SvelteComponent } from 'svelte';

    import type { Entity } from '../../../types/entityType';
    import BinarySensorPreview from '../../components/entities/binarySensor/BinarySensorPreview.svelte';
    import LightPreview from '../../components/entities/lights/LightPreview.svelte';
    import PlaceholderPreview from '../../components/entities/PlaceholderPreview.svelte';
    import PairDevice from '../../components/pairing/PairDevice.svelte';
    import SensorPreview from '../../components/entities/sensors/SensorPreview.svelte';
    import SwitchPreview from '../../components/entities/switchs/SwitchPreview.svelte';

    import RoundedButton from '../../components/UI/buttons/RoundedButton.svelte';
    import DeviceContainer from '../../components/UI/container/DeviceContainer.svelte';
    import EntityService, { actualDomains } from '../../services/entityService';
    import { tr } from '../../utils/i18nHelper';

    let isPairDeviceOpen = false;
    async function pair(event) {
        isPairDeviceOpen = true;
        // TODO: PAIR
        // const protocol = prompt('Protocol');
        // const body = JSON.stringify({ protocol });
        // const headers = new Headers();
        // headers.set('Content-Type', 'application/json');
        // await fetch('http://localhost:3000/device', {
        //     headers,
        //     method: 'POST',
        //     body,
        // }).then((x) => x.json());
        // alert('✔️');
    }

    const mapDomainToComp = new Map<string, typeof SvelteComponent>();
    mapDomainToComp.set('light', LightPreview);
    mapDomainToComp.set('binary_sensor', BinarySensorPreview);
    mapDomainToComp.set('sensor', SensorPreview);
    mapDomainToComp.set('switch', SwitchPreview);

    function getCompByDomain(entityId: string): typeof SvelteComponent {
        const domain = entityId.split('.')[0];
        return mapDomainToComp.get(domain) ?? PlaceholderPreview;
    }

    type EntityByDomain = {
        [key: string]: Entity<any>[];
    };

    async function loadEntities() {
        const entities = await EntityService.getActualEntities();
        // Group them by domain
        return entities.reduce((all: EntityByDomain, cur) => {
            const domain: string = cur.id.split('.')[0];
            all[domain] = all[domain] ?? [];
            all[domain].push(cur);
            return all;
        }, Object.create({}));
    }
</script>

<!-- Div containing all devices -->
<div id="test" class="pr-6 xl:pr-10 mb-20">
    {#await loadEntities()}
        {tr('devices.loading')}
    {:then values}
        {#each Object.entries(values).sort() as [domain, entities] (domain)}
            <DeviceContainer
                title={tr('devices.' + domain)}
                iconPath="favicon.png"
            >
                {#each entities as entity}
                    <svelte:component
                        this={getCompByDomain(entity.id)}
                        {...{ entity }}
                    />
                {/each}
            </DeviceContainer>
            <br />
        {/each}
    {/await}

    <!-- The + button to add device -->
    <div class="absolute bottom-0 right-0 h-16 w-16">
        <RoundedButton
            on:click={() => {
                isPairDeviceOpen = true;
            }}
            iconPath="icons/button/plus.svg"
        />
    </div>
</div>

{#if isPairDeviceOpen}
    <PairDevice
        on:cancel={() => {
            isPairDeviceOpen = false;
        }}
    />
{/if}

<style lang="scss">
    $color: rgb(8, 102, 0);

    div {
        color: $color;
    }

    #test {
        margin-left: 4%;
    }
</style>
