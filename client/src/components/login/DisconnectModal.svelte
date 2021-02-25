<script>
    import Modal from '../UI/modal/Modal.svelte';
    import CancelButton from '../UI/buttons/CancelButton.svelte';
    import BorderedButton from '../UI/buttons/BorderedButton.svelte';
    import InputBar from '../UI/bar/InputBar.svelte';
    import UserService from '../../services/userService';

    let newPassword = '';
    let submitted = false;

    export let open = false;

    async function lockFront(): Promise<void> {
        submitted = true;
        if (newPassword.length !== 0) {
            await UserService.lockFront(newPassword).then(() =>
                window.location.reload()
            );
        }
    }
</script>

<Modal bind:isOpen={open}>
    <div slot="content">
        <p class="max-w-sm">Vérrouillez, l'application avec un mot de passe</p>
        <br />
        <InputBar
            placeholder="Nouveau mot de passe"
            bind:submitted
            bind:input={newPassword}
            required={true}
        />
        <br />
        <div class="flex flex-row justify-center items-center space-x-4">
            <CancelButton
                on:click={() => {
                    open = false;
                    submitted = false;
                }}
            />
            <BorderedButton text="Valider" on:click={lockFront} />
        </div>
    </div>
</Modal>
