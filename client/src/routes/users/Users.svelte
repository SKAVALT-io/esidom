<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import type { User } from '../../../types/userType';
    import LoadingAnimation from '../../components/animations/LoadingAnimation.svelte';
    import RoundedButton from '../../components/UI/buttons/RoundedButton.svelte';
    import Tooltip from '../../components/UI/utils/Tooltip.svelte';
    import UserComponent from '../../components/users/UserComponent.svelte';
    import UserDetails from '../../components/users/UserDetails.svelte';
    import EntityService from '../../services/entityService';
    import UserService from '../../services/userService';
    import { tr } from '../../utils/i18nHelper';
    import toastService from '../../utils/toast';

    let users: User[];
    let emptyUser: User = {
        id: '',
        admin: false,
        username: '',
        entities: [],
    };
    let isCreateModalOpen = false;
    let entities: { id: string; name: string }[];
    let showCreateTip = false;

    async function getUsers(): Promise<void> {
        users = await UserService.getUsers();
        entities = await EntityService.getActualEntities().then((ents) =>
            ents.map((e) => ({ id: e.id, name: e.name }))
        );
    }

    function resetEmptyUser() {
        emptyUser = {
            id: '',
            admin: false,
            username: '',
            entities: [],
        };
    }

    async function handleCreateConfirm(user: User) {
        UserService.createUser(user.username, user.admin, user.entities)
            .then((u) => {
                users = [...users, u];
                toastService.toast(tr('user.userCreated'), 'info');
            })
            .catch((_err) => {
                toastService.toast(
                    tr('user.errorWhileCreating'),
                    'error'
                );
            });
        resetEmptyUser();
        isCreateModalOpen = false;
    }

    function handleCreateCancel() {
        isCreateModalOpen = false;
        resetEmptyUser();
    }
</script>

{#await getUsers()}
    <div id="loader" class="flex h-4/6 items-center justify-center">
        <LoadingAnimation />
    </div>
{:then}
    <!-- Create user -->
    <UserDetails
        {entities}
        user={emptyUser}
        title={tr('user.create')}
        handleSubmit={handleCreateConfirm}
        handleCancel={handleCreateCancel}
        bind:isModalOpen={isCreateModalOpen}
    />
    <div
        class="fixed bottom-0 z-10 right-0 h-16 w-16"
        on:touchstart={() => (showCreateTip = true)}
        on:touchend={() => (showCreateTip = false)}
        on:mouseleave={() => (showCreateTip = false)}
        on:mouseenter={() => (showCreateTip = true)}
    >
        <Tooltip
            text={tr('user.create')}
            position="left"
            show={showCreateTip}
        />
        <RoundedButton
            on:click={() => (isCreateModalOpen = true)}
            iconPath="icons/button/plus.svg"
        />
    </div>
    <div
        id="users"
        class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mr-2 ml-2 mt-2"
    >
        {#each users as user, i}
            <UserComponent
                {entities}
                {user}
                on:userdeleted={() => (users = users.filter((_u, index) => index !== i))}
            />
        {/each}
    </div>
{:catch err}
    <p class="text-red-800">{err.message}</p>
{/await}
