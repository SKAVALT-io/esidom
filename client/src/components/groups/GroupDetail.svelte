<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";

    import RoundedButton from "../UI/buttons/RoundedButton.svelte";
    import ToggleButton from "../UI/buttons/ToggleButton.svelte";
    import type { Group } from "../../../types/groupType";
    import Modal from "../../components/UI/modal/Modal.svelte";
    import SaveButton from "../UI/buttons/SaveButton.svelte";
    import { each } from "svelte/internal";

    import LoadingAnimation from "../../components/animations/LoadingAnimation.svelte";
    import EntityService from "../../services/entityService";
    import { tr } from "../../utils/i18nHelper";
    import GroupService from "../../services/groupService";

    export let currentGroup: Group;
    const dispatch = createEventDispatcher();
</script>

<div>
    <h1
        class=" block w-full text-center text-grey-darkest mb-6 font-bold text-3xl"
    >
        {currentGroup.groupId ? currentGroup.name : tr('groups.createGroup')}
    </h1>
    <form class="mb-4">
        <div class="flex flex-col mb-4">
            <label
                class="mb-2 font-bold text-lg text-grey-darkest"
                for="Name"
            >{tr('groups.groupName')}</label>
            <input
                type="text"
                name="Name"
                id="Name"
                bind:value={currentGroup.name}
                class="border py-2 px-3 text-grey-darkest"
                on:change={(val) => console.log(val)}
                placeholder={tr('groups.groupName')}
            />
        </div>
        <div class="block">
            <label
                class="mb-2 font-bold text-lg text-grey-darkest"
                for="Name"
            >{tr('groups.groupEntities')}</label>

            <div class="mt-2">
                {#await EntityService.getOnlyEquipmentEntity()}
                    <div class="loader">
                        <LoadingAnimation />
                    </div>
                {:then entities}
                    {#each entities as entity}
                        <div>
                            <label class="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    class="form-checkbox"
                                    checked={currentGroup.entities.find((e) => {
                                        return e.id === entity.id;
                                    })}
                                    on:click={(val) => {
                                        console.log(val.target.checked);
                                        if (val.target.checked) {
                                            currentGroup.entities.push(entity);
                                        } else {
                                            currentGroup.entities = currentGroup.entities.filter((e) => e.id !== entity.id);
                                        }
                                        console.log(currentGroup.entities);
                                    }}
                                />
                                <span
                                    class="ml-2"
                                >{entity.name ? entity.name : entity.id}</span>
                            </label>
                        </div>
                    {/each}
                {/await}
            </div>
        </div>
        <div class="flex flex-col mb-4">
            <SaveButton
                on:click={() => {
                    console.log(currentGroup.entities);
                    currentGroup.groupId ? GroupService.updateGroup(currentGroup) : GroupService.createGroup(currentGroup);
                    dispatch('update');
                }}
            />
        </div>
    </form>
</div>

<style>
    input {
        background-color: #453b69;
    }

    .container {
        grid-template-columns: 100px 50px 100px;
        grid-template-rows: 80px auto 80px;
        column-gap: 10px;
        row-gap: 15px;
    }
</style>
