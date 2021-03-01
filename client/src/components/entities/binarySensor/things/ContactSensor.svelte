<script>
    // Contact: If true the door is closed, else it means it is open
    export let value: boolean;
</script>

<div class="col-span-3 row-start-2 text-right">Contact :</div>
<div class="col-span-9 row-start-2">{value ? 'oui' : 'non'}</div>
