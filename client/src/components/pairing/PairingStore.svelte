<script lang="ts" context="module">
    import { empty } from 'svelte/internal';

    import { writable } from 'svelte/store';
    import type { Device } from '../../../types/deviceType';

    /* use to make page changes during the different pairing steps */
    export const step = writable('InstructionPage');
    export const protocols = writable({});

    /*use to retrieve / share object pair founded during the pairing operation*/
    export class DeviceFound {
        public static data: Device;
    }

    /*reset the pairing procedure*/
    export function reset() {
        step.update(() => 'InstructionPage');
    }
</script>
