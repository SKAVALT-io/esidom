<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Group } from '../../../types/groupType';
    import SaveButton from '../UI/buttons/SaveButton.svelte';

    import LoadingAnimation from '../../components/animations/LoadingAnimation.svelte';
    import EntityService from '../../services/entityService';
    import { tr } from '../../utils/i18nHelper';
    import GroupService from '../../services/groupService';
    import InputBar from '../UI/bar/InputBar.svelte';
    import CancelButton from '../UI/buttons/CancelButton.svelte';
    import ReturnButton from '../UI/buttons/ReturnButton.svelte';
    import { push } from 'svelte-spa-router';
    import type { Entity } from '../../../types/entityType';

    export let currentGroup: Group;
    export let editMode: boolean = false;

    export let entities: Entity<unknown>[];
    $: formInvalid =
        currentGroup.name === '' || currentGroup.entities.length === 0;

    console.log(currentGroup, editMode);
    const dispatch = createEventDispatcher();
    function save() {
        currentGroup.groupId !== ''
            ? GroupService.updateGroup(currentGroup)
            : GroupService.createGroup(currentGroup);
        dispatch('close');
    }

    function handleCheckbox(val: any, entity: Entity<unknown>) {
        if (val.target.checked) {
            currentGroup.entities.push(entity);
        } else {
            currentGroup.entities = currentGroup.entities.filter(
                (e) => e.id !== entity.id
            );
        }
        formInvalid =
            currentGroup.name === '' || currentGroup.entities.length === 0;
    }
</script>

<div>
    <h1
        class=" block w-full text-center text-grey-darkest mb-6 font-bold text-3xl"
    >
        {currentGroup.groupId !== '' ? currentGroup.name : tr('groups.createGroup')}
    </h1>
    {#if editMode}
        <form class="mb-4">
            <div class="flex flex-col mb-4">
                <InputBar
                    label={tr('groups.groupName')}
                    bind:input={currentGroup.name}
                    placeholder={tr('groups.groupName')}
                    required={true}
                    width="56"
                />
            </div>
            <div class="block">
                <label
                    class="mb-2 font-bold text-lg text-grey-darkest"
                    for="Name"
                >{tr('groups.groupEntities')}</label>

                <div class="mt-2">
                    {#each entities as entity}
                        <div>
                            <label class="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    class="form-checkbox"
                                    checked={currentGroup.entities.find((e) => e.id === entity.id) !== undefined}
                                    on:click={(val) => handleCheckbox(val, entity)}
                                />
                                <span
                                    class="ml-2"
                                >{entity.name ? entity.name : entity.id}</span>
                            </label>
                        </div>
                    {/each}
                </div>
            </div>
            <div class="flex flex-col mb-4 pt-6">
                <SaveButton bind:isDisabled={formInvalid} on:click={save} />
            </div>
        </form>
    {:else}
        <div class="mb-4">
            <label
                class="mb-2 font-bold text-lg text-grey-darkest"
                for="Name"
            >{tr('groups.groupEntities')}</label>
            <ul class="pt-4">
                {#each currentGroup.entities as entity}
                    <li
                        class="border list-none rounded-sm px-3 py-3 hover:bg-blue-900 cursor-pointer"
                        on:click={() => push(`#/entity/${entity.id}`)}
                    >
                        {entity?.name ?? ''}
                    </li>
                {/each}
            </ul>

            <div class="flex flex-col mb-4 pt-6">
                <ReturnButton
                    on:click={() => {
                        dispatch('close');
                    }}
                />
            </div>
        </div>
    {/if}
</div>

<style>
    input {
        background-color: #453b69;
    }
</style>
