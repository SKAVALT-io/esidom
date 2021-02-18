<script lang="ts">
    import GroupService from "../../services/groupService";
    import Group from "../../components/groups/Group.svelte";
    import Modal from "../../components/UI/modal/Modal.svelte";
</script>

{#await GroupService.getGroup()}
    <p>loading</p>
{:then groups}
    <div
        id="group"
        class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mr-2 ml-2 mt-2"
    >
        {#each groups as group}
            <Group {group} />
        {/each}
    </div>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
