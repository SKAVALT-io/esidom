<script context="module">
    import { writable } from 'svelte/store';

    /* use to make page changes during the different pairing steps */
    export const step = writable('InstructionPage');

    /*use to retrieve / share object pair*/
    export class Device {
        public static data: any;
    }

    /*reset the pairing procedure*/
    export function reset() {
        step.update(() => 'InstructionPage');
    }
</script>
