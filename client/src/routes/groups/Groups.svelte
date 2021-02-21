<script lang="ts">
    import GroupService from "../../services/groupService";
    import GroupComponent from "../../components/groups/GroupComponent.svelte";
    import Modal from "../../components/UI/modal/Modal.svelte";
    import GroupDetail from "../../components/groups/GroupDetail.svelte";
    import type { Group } from "../../../types/groupType";
    import LoadingAnimation from "../../components/animations/LoadingAnimation.svelte";
    import DropdownButton from "../../components/UI/buttons/DropdownButton.svelte";
    import RoundedButton from "../../components/UI/buttons/RoundedButton.svelte";
    import SearchBar from "../../components/others/SearchBar.svelte";
    import { tr } from "../../utils/i18nHelper";

    let isOpen = false;
    let currentGroup: Group = {
        groupId: "init",
        name: "Name of the group",
        entities: [],
    };
    let flipSwitch = false;
</script>

<div
    class="pt-2 flex justify-between relative right-0 top-0 mt-2 mr-2 ml-2 mx-auto text-white"
>
    <h1 class="text-2xl">{tr('groups.myGroups')}</h1>
    <div>
        <DropdownButton
            dropDownOptions={[tr('groups.sortBy.options.name')]}
            title={tr('groups.sortBy.title')}
            arrowUp={flipSwitch}
            on:click={(e) => {}}
        />
        <SearchBar
            debounce={300}
            on:type={(e) => {
                console.log(e);
            }}
            on:clear={(e) => console.log(e)}
        />
    </div>
</div>
{#await GroupService.getGroup()}
    <div class="loader">
        <LoadingAnimation />
    </div>
{:then groups}
    <div
        id="group"
        class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mr-2 ml-2 mt-2"
    >
        {#each groups as group}
            <GroupComponent
                {group}
                on:click={() => {
                    currentGroup = group;
                    isOpen = true;
                }}
            />
        {/each}
    </div>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}

<Modal bind:isOpen>
    <div slot="content">
        <GroupDetail bind:currentGroup />
    </div>
</Modal>
<div class="fixed bottom-0 right-0 h-16 w-16">
    <RoundedButton
        on:click={() => {
            isOpen = true;
            currentGroup = { entities: [] };
        }}
        iconPath="icons/button/plus.svg"
    />
</div>

<style>
    .loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;

        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
