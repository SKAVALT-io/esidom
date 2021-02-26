<script lang="ts">
    import Modal from '../UI/modal/Modal.svelte';
    import { tr } from '../../utils/i18nHelper';
    import CancelButton from '../UI/buttons/CancelButton.svelte';
    import BorderedButton from '../UI/buttons/BorderedButton.svelte';
    import type { User } from '../../../types/userType';
    import UserService from '../../services/userService';
    import InputBar from '../UI/bar/InputBar.svelte';

    export let user: User;
    export let entities: { id: string; name: string }[];
    export let isModalOpen = false;

    async function handleConfirm() {
        isModalOpen = false;
        await UserService.updateUser(
            user.id,
            user.username,
            user.admin,
            user.entities
        );
        window.location.reload();
    }
</script>

<Modal bind:isOpen={isModalOpen}>
    <div slot="content">
        <h1
            class=" block w-full text-center text-grey-darkest mb-6 font-bold text-3xl"
        >
            {tr('user.edit')}
        </h1>
        <form class="mb-4">
            <div class="flex flex-col mb-4">
                <label
                    class="mb-2 font-bold text-lg text-grey-darkest"
                    for="Name"
                >{tr('user.name')}</label>
                <InputBar
                    bind:input={user.username}
                    placeholder={user.username}
                />
            </div>
            <div class="block">
                <label
                    class="mb-2 font-bold text-lg text-grey-darkest"
                    for="Name"
                >{tr('user.assignEntities')}</label>

                <div class="mt-2">
                    {#each entities as entity}
                        <div>
                            <label class="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    class="form-checkbox"
                                    checked={user.entities.includes(entity.id)}
                                    on:click={(val) => {
                                        if (val.target.checked) {
                                            user.entities = [entity.id, ...user.entities];
                                        } else {
                                            user.entities = user.entities.filter((e) => e !== entity.id);
                                        }
                                    }}
                                />
                                <span class="ml-2">{entity.name}</span>
                            </label>
                        </div>
                    {/each}
                </div>
            </div>
        </form>
        <div id="confirm_cancel" class="flex justify-center items- space-x-4">
            <CancelButton on:click={() => (isModalOpen = false)} />
            <BorderedButton
                text={tr('buttons.confirm')}
                on:click={handleConfirm}
            />
        </div>
    </div>
</Modal>
