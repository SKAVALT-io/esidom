<script lang="ts">
    import getStaff from '../../utils/skavalt';
    import TailwindExample from '../../components/default/TailwindExample.svelte';

    const names = getStaff().join(', ');
</script>

Welcome to SKAVALT :)
<br /><br />

<div id="cool">
    <TailwindExample />
</div>

<br /><br />

Made by
{names}

<style>
    #cool {
        margin: 0 20%;
    }
</style>
