<script>
    import { createEventDispatcher } from 'svelte';
    import { tr } from '../../../utils/i18nHelper';

    import BorderedButton from '../buttons/BorderedButton.svelte';

    import CancelButton from '../buttons/CancelButton.svelte';

    import Modal from './Modal.svelte';

    const dispatch = createEventDispatcher();
    export let isOpen = false;
    export let text: string;
</script>

{#if isOpen}
    <Modal bind:isOpen>
        <div slot="content">
            <p>{text}</p>
            <br />
            <div id="confirm_cancel">
                <CancelButton on:click={() => (isOpen = false)} />
                <BorderedButton
                    text={tr('buttons.confirm')}
                    on:click={() => dispatch('confirm')}
                />
            </div>
        </div>
    </Modal>
{/if}
