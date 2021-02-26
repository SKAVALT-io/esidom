<script lang="ts">
    import type { User } from '../../../types/userType';
    import LoadingAnimation from '../../components/animations/LoadingAnimation.svelte';
    import RoundedButton from '../../components/UI/buttons/RoundedButton.svelte';
    import Tooltip from '../../components/UI/utils/Tooltip.svelte';
    import UserComponent from '../../components/users/UserComponent.svelte';
    import EntityService from '../../services/entityService';
    import UserService from '../../services/userService';
    import { tr } from '../../utils/i18nHelper';

    let users: User[];
    let entities: { id: string; name: string }[];
    let showCreateTip = false;
    async function getUsers(): Promise<void> {
        users = await UserService.getUsers();
        entities = await EntityService.getActualEntities().then((ents) =>
            ents.map((e) => ({ id: e.id, name: e.name }))
        );
    }
</script>

{#await getUsers()}
    <div id="loader" class="flex h-4/6 items-center justify-center">
        <LoadingAnimation />
    </div>
{:then}
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
            on:click={() => {
                console.log('TODO');
            }}
            iconPath="icons/button/plus.svg"
        />
    </div>
    <div
        id="users"
        class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mr-2 ml-2 mt-2"
    >
        {#each users as user}
            <UserComponent {entities} {user} />
        {/each}
    </div>
{:catch err}
    <p class="text-red-800">{err.message}</p>
{/await}
