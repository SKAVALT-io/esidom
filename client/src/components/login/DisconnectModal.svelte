<script>
    import Modal from '../UI/modal/Modal.svelte';
    import CancelButton from '../UI/buttons/CancelButton.svelte';
    import BorderedButton from '../UI/buttons/BorderedButton.svelte';
    import UserService from '../../services/userService';
    import { tr } from '../../utils/i18nHelper';
    import toastService from '../../utils/toast';
    import InputPasswordBar from '../UI/bar/InputPasswordBar.svelte';

    let newPassword = '';
    let confirmation = '';
    let submitted = false;

    export let open = false;

    async function lockFront(): Promise<void> {
        if (
            newPassword.length > 0 &&
            confirmation.length > 0 &&
            newPassword === confirmation
        ) {
            submitted = true;
            await UserService.lockFront(newPassword).then(() =>
                window.location.reload()
            );
        } else {
            toastService.toast('Les mots de passe sont différents');
            newPassword = '';
            confirmation = '';
        }
    }

    function handleKeyPressed(e: KeyboardEvent) {
        switch (e.key.toLowerCase()) {
            case 'enter': // ENTER
                lockFront();
                break;
            case 'escape': // ESCAPE
                closeModal();
                break;
            default:
                break;
        }
    }

    function closeModal() {
        open = false;
        submitted = false;
        newPassword = '';
        confirmation = '';
    }
</script>

<Modal bind:isOpen={open}>
    <div slot="content">
        <p class="max-w-sm">{tr('modal.registerPassword')}</p>
        <br />
        <InputPasswordBar
            placeholder={tr('placeholder.newPassword')}
            bind:submitted
            bind:input={newPassword}
            required={true}
            autofocus={true}
            on:keydown={handleKeyPressed}
        />
        <InputPasswordBar
            placeholder={tr('placeholder.confirmation')}
            bind:submitted
            bind:input={confirmation}
            required={true}
            on:keydown={handleKeyPressed}
        />
        <br />
        <div class="flex flex-row justify-center items-center space-x-4">
            <CancelButton on:click={closeModal} />
            <BorderedButton
                type="submit"
                text={tr('buttons.confirm')}
                on:click={lockFront}
            />
        </div>
    </div>
</Modal>
