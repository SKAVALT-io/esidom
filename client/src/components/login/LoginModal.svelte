<script>
    import Modal from '../UI/modal/Modal.svelte';
    import CancelButton from '../UI/buttons/CancelButton.svelte';
    import BorderedButton from '../UI/buttons/BorderedButton.svelte';
    import UserService from '../../services/userService';
    import { tr } from '../../utils/i18nHelper';
    import { onMount } from 'svelte';
    import type { User } from '../../../types/userType';
    import { push } from 'svelte-spa-router';
    import { getCurrentPage } from '../../utils/functions';

    export let open = false;
    let selectedUser: User;

    function closeModal() {
        open = false;
    }

    let users: User[] = [];
    onMount(async () => {
        users = await UserService.getUsers();
    });

    async function connect(): Promise<void> {
        UserService.user.set(selectedUser);
        closeModal();
        const currentPage = getCurrentPage();
        if (
            (!selectedUser.admin && currentPage === 'users') ||
            currentPage !== 'entities'
        ) {
            push('/entities');
        } else {
            setTimeout(() => window.location.reload(), 500);
        }
    }
</script>

<Modal bind:isOpen={open}>
    <div slot="content">
        <p class="max-w-sm">{tr('modal.login')}</p>
        <br />
        <select
            bind:value={selectedUser}
            class="px-2 py-2 pr-4 w-full placeholder-gray-400 text-gray-900 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline"
        >
            {#each users as user, i}
                {#if user.id === UserService.currentUser?.id}
                    <option value={user} selected>{user.username}</option>
                {:else}
                    <option value={user}>{user.username}</option>
                {/if}
            {/each}
        </select>

        <br /><br />
        <div class="flex flex-row justify-center items-center space-x-4">
            <CancelButton on:click={closeModal} />
            <BorderedButton
                type="submit"
                text={tr('buttons.confirm')}
                on:click={connect}
            />
        </div>
    </div>
</Modal>
