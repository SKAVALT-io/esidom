<script lang="ts">
    import { push } from "svelte-spa-router";
    import { onDestroy, onMount } from "svelte";

    import RoundedButton from "../UI/buttons/RoundedButton.svelte";
    import ToggleButton from "../UI/buttons/ToggleButton.svelte";
    import type { Group } from "../../../types/groupType";
    import Modal from "../../components/UI/modal/Modal.svelte";
    import SaveButton from "../UI/buttons/SaveButton.svelte";
    import { each } from "svelte/internal";

    export let currentGroup: Group;

    $: checked = true;
</script>

<div>
    <h1
        class=" block w-full text-center text-grey-darkest mb-6 font-bold text-3xl"
    >
        Create new group
    </h1>
    <form class="mb-4">
        <div class="flex flex-col mb-4">
            <label
                class="mb-2 font-bold text-lg text-grey-darkest"
                for="Name"
            >Nom du group</label>
            <input
                type="text"
                name="Name"
                id="Name"
                value={currentGroup.name}
                class="border py-2 px-3 text-grey-darkest"
            />
        </div>
        <div class="block">
            <label
                class="mb-2 font-bold text-lg text-grey-darkest"
                for="Name"
            >Equipement dans le groupe</label>

            <div class="mt-2">
                {#each currentGroup.entities as entity}
                    <div>
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                class="form-checkbox"
                                checked={currentGroup.entities.includes(entity)}
                            />
                            <span class="ml-2">{entity.name}</span>
                        </label>
                    </div>
                {/each}
            </div>
        </div>

        <SaveButton />
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
