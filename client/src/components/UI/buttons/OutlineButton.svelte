<script>
    export let text = '';
    export let backGroundColor = 'bg-transparent';
</script>

<button
    on:click
    class="{backGroundColor} text-center text-gray-100 hover:text-gray-300 py-1 px-4 border-2 border-gray-100 hover:border-gray-300 rounded-md"
>
    <span>{text}</span>
</button>
