<script lang="ts">
    import Modal from '../UI/modal/Modal.svelte';
    import { tr } from '../../utils/i18nHelper';
    import CancelButton from '../UI/buttons/CancelButton.svelte';
    import BorderedButton from '../UI/buttons/BorderedButton.svelte';
    import type { User } from '../../../types/userType';
    import InputBar from '../UI/bar/InputBar.svelte';
    import toastService from '../../utils/toast';

    export let user: User;
    export let entities: { id: string; name: string }[];
    export let isModalOpen = false;
    export let title = '';
    export let handleSubmit: (user: User) => void;
    export let handleCancel: () => void = () => {
        isModalOpen = false;
    };

    function checkBeforeSubmit() {
        if (user.username === '') {
            toastService.toast(tr('user.usernameCannotBeEmpty'), 'error');
            return;
        }
        handleSubmit(user);
    }
</script>

<Modal close={handleCancel} bind:isOpen={isModalOpen}>
    <div slot="content">
        <h1
            class=" block w-full text-center text-grey-darkest mb-6 font-bold text-3xl"
        >
            {title}
        </h1>
        <form class="mb-4">
            <div class="flex flex-col mb-4">
                <label
                    class="mb-2 font-bold text-lg text-grey-darkest"
                    for="Name"
                >{tr('user.name')}</label>
                <InputBar
                    bind:input={user.username}
                    placeholder={user.username || tr('user.name')}
                    required={true}
                />
            </div>
            {#if !user.admin}
                <div class="block">
                    <label
                        class="mb-2 font-bold text-lg text-grey-darkest"
                        for="Name"
                    >{tr('user.assignEntities')}</label>

                    <div class="mt-2 h-60 overflow-y-auto">
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
            {/if}
        </form>
        <div id="confirm_cancel" class="flex justify-center items- space-x-4">
            <CancelButton on:click={handleCancel} />
            <BorderedButton
                text={tr('buttons.confirm')}
                on:click={checkBeforeSubmit}
            />
        </div>
    </div>
</Modal>
