<script context="module">
    import { writable } from 'svelte/store';

    export const step = writable('InstructionPage');
    export let device;

    export function reset() {
        step.update(() => 'InstructionPage');
    }
</script>
