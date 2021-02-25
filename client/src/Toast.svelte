<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { backOut } from 'svelte/easing';
    import toastService from './utils/toast';

    let toasts: string[] = [];

    const unshiftToast = () => {
        toasts = toasts.filter((_, i) => i > 0);
    };

    toastService.subscribe((t) => {
        if (t.msg) {
            toasts = [...toasts, t.msg];
            setTimeout(unshiftToast, t.msg.length * 200);
        }
    });
</script>

<!-- Enable this to test toasts manually -->
<!-- <button
    on:click={() => toastService.toast('Request failed with status 401 :((')}
>{toasts.length}</button> -->

<div id="toasts" class="absolute top-0 right-5" style="z-index: 9999">
    {#each toasts as toast}
        <div
            in:fly={{ delay: 0, duration: 300, x: 0, y: 50, opacity: 0.1, easing: backOut }}
            out:fade={{ duration: 500 }}
            class="toast py-5 my-2 w-44 rounded-xl flex text-center"
        >
            {toast}
        </div>
    {/each}
</div>

<style>
    .toast {
        z-index: 9999;
        min-height: 3rem;
        background: rgba(0, 0, 0, 0.7);
    }
</style>
