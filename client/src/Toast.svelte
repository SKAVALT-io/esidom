<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { backOut } from 'svelte/easing';
    import toastService from './utils/toast';
    import type { ToastMessage } from '../types/toastMessage';

    let toasts: ToastMessage[] = [];

    const unshiftToast = () => {
        toasts = toasts.filter((_, i) => i > 0);
    };

    toastService.subscribe((t) => {
        if (t.msg) {
            toasts = [...toasts, t];
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
            class="text-white px-6 py-4 border-0 rounded-xl relative mb-4 {toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}"
        >
            <span class="text-xl inline-block mr-5 align-middle">
                {#if toast.type === 'info'}
                    <img
                        class="w-5 h-5"
                        src={'icons/toast/information.svg'}
                        alt=""
                    />
                {:else if toast.type === 'error'}
                    <img class="w-5 h-5" src={'icons/toast/close.svg'} alt="" />
                {/if}
            </span>
            <span class="inline-block align-middle mr-8"> {toast.msg} </span>
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
