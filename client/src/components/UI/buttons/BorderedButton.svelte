<script>
    export let text = '';
    export let type: 'button' | 'menu' | 'reset' | 'submit' = 'button';
</script>

<button
    on:click
    on:submit
    type="${type}"
    class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 border border-blue-700 rounded "
>
    <span>{text}</span>
</button>
