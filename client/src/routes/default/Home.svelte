<script lang="ts">
    import getStaff from '../../utils/skavalt';
    import TailwindExample from '../../components/default/TailwindExample.svelte';

    const names = getStaff().join(', ');
</script>

<div id="test">
    Welcome to SKAVALT :)
    <br /><br />

    <div id="cool" class="flex">
        <TailwindExample />
    </div>

    <br /><br />

    Made by
    {names}
</div>

<style>
    #cool {
        margin: 0 20%;
    }

    #test {
        margin-left: 4%;
    }
</style>
