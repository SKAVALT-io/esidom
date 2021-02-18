<script lang="ts">
    // eslint-disable-next-line import/first
    import { onMount } from 'svelte';
    export let formatDate = '';

    let date = new Date();
    let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    $: hour = date.getHours();
    $: min = date.getMinutes();
    $: sec = date.getSeconds();

    function format(num: number): string {
        return num < 10 ? '0' + num.toString() : num.toString();
    }

    onMount(() => {
        const interval = setInterval(() => {
            date = new Date();
        }, 1000);
    });
</script>

<section>
    <div>
        <p>
            {#if formatDate == 'long'}
                {date.toLocaleDateString('fr-FR', options).toUpperCase()}
                -
            {/if}
            {format(hour)}
            :
            {format(min)}
            :
            {format(sec)}
        </p>
    </div>
</section>
