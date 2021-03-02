<script lang="ts">
    import type { User } from '../../../types/userType';
    import RoundedButton from '../UI/buttons/RoundedButton.svelte';
    import Tooltip from '../UI/utils/Tooltip.svelte';
    import { tr } from '../../utils/i18nHelper';
    import Modal from '../UI/modal/Modal.svelte';
    import CancelButton from '../UI/buttons/CancelButton.svelte';
    import BorderedButton from '../UI/buttons/BorderedButton.svelte';
    import UserDetails from './UserDetails.svelte';
    import UserService from '../../services/userService';
    import toastService from '../../utils/toast';
    import { createEventDispatcher } from 'svelte';

    export let user: User;
    export let entities: { id: string; name: string }[];
    let showEditTip = false;
    let showDeleteTip = false;
    let isConfirmDeleteOpen = false;
    let isEditModalOpen = false;
    const dispatch = createEventDispatcher();

    function handleEdit(): void {
        isEditModalOpen = true;
    }

    async function handleDelete(): Promise<void> {
        isConfirmDeleteOpen = false;
        UserService.deleteUser(user.id)
            .then(() => {
                toastService.toast(`L'utilisateur a bien été supprimé`);
                dispatch('userdeleted');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function handleEditConfirm(updatedUser: User) {
        isEditModalOpen = false;
        user = await UserService.updateUser(
            updatedUser.id,
            updatedUser.username,
            updatedUser.admin,
            updatedUser.entities
        );
        if (user.id === UserService.currentUser?.id) {
            UserService.user.set(user);
        }
    }
</script>

<!-- Edit user-->
<UserDetails
    {entities}
    {user}
    title={tr('user.edit')}
    handleSubmit={handleEditConfirm}
    bind:isModalOpen={isEditModalOpen}
/>
<div
    id="user"
    class="rounded-lg items-center text-center grid grid-cols-5 px-1 py-4"
>
    <div class="content-center col-span-3 capitalize">{user.username}</div>
    {#if user.admin}
        <div class="content-center col-span-1 text-green-500"><i>Admin</i></div>
    {/if}

    <div
        id="edit_button"
        class="col-span-1 relative"
        on:touchstart={() => (showEditTip = true)}
        on:touchend={() => (showEditTip = false)}
        on:mouseleave={() => (showEditTip = false)}
        on:mouseenter={() => (showEditTip = true)}
    >
        <Tooltip
            text={tr('automations.buttons.edit')}
            position="top"
            show={showEditTip}
        />
        <RoundedButton
            size={8}
            on:click={handleEdit}
            iconPath="icons/button/edit.svg"
        />
    </div>

    {#if !user.admin}
        <div
            id="delete_button"
            class="col-span-1 relative"
            on:touchstart={() => (showDeleteTip = true)}
            on:touchend={() => (showDeleteTip = false)}
            on:mouseleave={() => (showDeleteTip = false)}
            on:mouseenter={() => (showDeleteTip = true)}
        >
            <Tooltip
                text={tr('automations.buttons.delete')}
                position="top"
                show={showDeleteTip}
            />
            <RoundedButton
                size={8}
                on:click={() => (isConfirmDeleteOpen = true)}
                iconPath="icons/button/trash.svg"
            />
        </div>
        {#if isConfirmDeleteOpen}
            <div id="confirm_modal" class="z-10">
                <Modal bind:isOpen={isConfirmDeleteOpen}>
                    <div slot="content">
                        <p>{tr('user.confirmDelete')}</p>
                        <br />
                        <div id="confirm_cancel">
                            <CancelButton
                                on:click={() => (isConfirmDeleteOpen = false)}
                            />
                            <BorderedButton
                                text={tr('buttons.confirm')}
                                on:click={handleDelete}
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        {/if}
    {/if}
</div>

<style>
    #user {
        background-color: #22164d;
    }
</style>
