<script>
    export let isDisabled = false;
    export let text = '';
    export let type: 'button' | 'menu' | 'reset' | 'submit' = 'button';
</script>

<button
    on:click
    on:submit
    type="${type}"
    disabled={isDisabled}
    class="text-white py-1 px-3 border {isDisabled ? 'bg-gray-500 cursor-not-allowed ' : 'bg-blue-500 hover:bg-blue-600  border-blue-700'} rounded"
>
    <span>{text}</span>
</button>
