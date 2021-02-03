<script lang="ts">
    import TailwindExample from '../../components/default/TailwindExample.svelte';
    import getStaff from '../squalala';

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
