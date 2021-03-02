<script>
    /* Stolen from https://github.com/fouita/svelte-tw-tooltip/blob/master/src/Tooltip.svelte */
    // TODO: make a better one
    /* eslint-disable camelcase */
    import { fade } from 'svelte/transition';

    export let position: 'top' | 'left' | 'bottom' | 'right' = 'top';
    export let pointer: 'start' | 'middle' | 'end' = 'middle';
    export let color = 'black';
    export let text_color = 'white';
    export let text = '';
    export let show = true;
    export let w: string | null = null;

    const points = {
        top: '0,0 127.5,127.5 255,0',
        right: '255,0 127.5,127.5 255,255',
        left: '0,0 127.5,127.5 0,255',
        bottom: '0,255 127.5,127.5 255,255',
    };

    let pointer_class = 'left-0';
    let cursor_class = '';
    let elm_class = '';
    let lhidden = 'opacity-0';
    let current_node: any = null;

    function mposition(node: any) {
        try {
            current_node = node;
            let m = 0;
            if (position == 'top' || position == 'bottom') {
                if (pointer == 'middle') {
                    m = node.parentNode.clientWidth / 2 - node.clientWidth / 2;
                    node.style.marginLeft = `${m}px`;
                    cursor_class = 'w-full';
                } else if (pointer == 'start') {
                    pointer_class = 'left-0';
                    cursor_class = 'ml-2';
                } else if (pointer == 'end') {
                    pointer_class = 'right-0';
                    cursor_class = 'mr-2';
                }
                elm_class = position == 'top' ? 'mb-2' : 'mt-2';
            } else {
                if (pointer == 'middle') {
                    m =
                        node.parentNode.clientHeight / 2 -
                        node.clientHeight / 2;
                    node.style.marginTop = `${m}px`;
                    cursor_class = 'h-full w-2';
                    pointer_class = 'top-0';
                } else if (pointer == 'start') {
                    pointer_class = 'top-0';
                    cursor_class = 'mt-2';
                } else if (pointer == 'end') {
                    cursor_class = 'mb-2';
                    pointer_class = 'bottom-0';
                }
                elm_class = position == 'left' ? 'mr-2' : 'ml-2';
            }
        } catch (_) {
            // do nothing
        }
        lhidden = 'opacity-100';
    }
    const inv_position = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left',
    };

    let otext: string | null = null;
    $: if (text && otext != text && current_node) {
        otext = text;
        setTimeout(() => mposition(current_node));
    }
</script>

{#if show}
    <div
        transition:fade={{ duration: 100 }}
        class="absolute z-40 {lhidden}
      {inv_position[position]}-100 {elm_class}
      {pointer_class}
      {w ? `w-${w}` : 'min-w-full'}"
        use:mposition
    >
        <div class="relative shadow-md">
            <slot>
                <div
                    class="bg-{color} text-{text_color} truncate text-xs rounded py-1 px-4"
                >
                    {text}
                </div>
            </slot>
            <svg
                class="absolute text-{color}
          {cursor_class} h-2 {pointer_class}
          {position}-100"
                x="0px"
                y="0px"
                viewBox="0 0 255 255"
                xml:space="preserve"
            >
                <polygon class="fill-current" points={points[position]} />
            </svg>
        </div>
    </div>
{/if}

<style>
    .top-100 {
        top: 100%;
    }
    .bottom-100 {
        bottom: 100%;
    }
    .left-100 {
        left: 100%;
    }
    .right-100 {
        right: 100%;
    }
</style>
