<script lang="ts">
    import getStaff from '../../utils/skavalt';
    import TailwindExample from '../../components/default/TailwindExample.svelte';
    import { format, tr } from '../../utils/i18nHelper';

    const names = getStaff().join(', ');
</script>

<div>
    {format(tr('home.welcome'), tr('app.name'))}
    <br /><br />

    <div id="cool" class="flex">
        <TailwindExample />
    </div>

    <br /><br />

    {format(tr('home.realizedBy'), names)}
</div>

<style>
    #cool {
        margin: 0 20%;
    }
</style>
