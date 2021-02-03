<script lang="ts">
    import { onMount } from 'svelte';

    let count = 0;
    onMount(() => {
        const interval = setInterval(() => ++count, 1000);
        return () => {
            clearInterval(interval);
        };
    });
</script>

<figure
    class="md:flex bg-gradient-to-tr from-yellow-200 to-purple-600 rounded-xl p-8 md:p-0"
>
    <img
        class="hover:bg-blue-500 w-32 h-32 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto bg-red-500"
        src="/favicon.png"
        alt=""
        width="384"
        height="512"
    />
    <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
        <blockquote>
            <p class="text-lg font-semibold">
                “Tailwind CSS is the only framework that I've seen scale on
                large teams. It’s easy to customize, adapts to any design, and
                the build size is tiny. Yo comment tu vas ?”
            </p>
        </blockquote>
        <figure>
            <figcaption class="font-medium">
                <div class="text-cyan-600">Altan, il y a {count} secondes</div>
            </figcaption>
        </figure>
    </div>
</figure>

<style>
    div p {
        margin: 0.4rem;
    }
</style>
