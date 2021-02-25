<script lang="ts">
    import { push } from 'svelte-spa-router';
    import { onDestroy, onMount } from 'svelte';
    import type { AutomationPreview } from '../../../types/automationType';
    import AutomationService from '../../services/automationService';
    import RoundedButton from '../UI/buttons/RoundedButton.svelte';
    import ToggleButton from '../UI/buttons/ToggleButton.svelte';
    import { socketManager } from '../../managers/socketManager';
    import Tooltip from '../UI/utils/Tooltip.svelte';
    import Modal from '../UI/modal/Modal.svelte';
    import { tr } from '../../utils/i18nHelper';
    import CancelButton from '../UI/buttons/CancelButton.svelte';
    import BorderedButton from '../UI/buttons/BorderedButton.svelte';

    export let automation: AutomationPreview;

    $: checked = automation.state === 'on';
    let isConfirmDeleteOpen = false;

    let showTriggerTip = false;
    let showEditTip = false;
    let showDeleteTip = false;

    function handleToggle() {
        checked = !checked;
        AutomationService.toggleAutomation(automation.id, {
            state: checked ? 'on' : 'off',
        });
    }

    function handleEdit() {
        push(`/blockly/${automation.id}`);
    }

    function handleTrigger() {
        AutomationService.triggerAutomation(automation.id);
    }

    function handleDelete() {
        AutomationService.deleteAutomation(automation.id);
        isConfirmDeleteOpen = false;
    }

    function automationUpdatedHandler(data: AutomationPreview) {
        automation = data;
    }

    onMount(async () => {
        socketManager.registerListenerById<AutomationPreview>(
            'automationUpdated',
            automation.id,
            automationUpdatedHandler
        );
    });

    onDestroy(() => {
        socketManager.removeListener(
            'automationUpdated',
            automationUpdatedHandler
        );
    });
</script>

<div
    id="automation"
    class="rounded-lg items-center text-center grid grid-cols-9 px-1 py-4"
>
    <div class="col-span-1">
        <ToggleButton on:change={handleToggle} bind:checked />
    </div>
    <div class="content-center col-span-5">{automation.name}</div>
    <div
        id="trigger_button"
        class="col-span-1 relative"
        on:touchstart={() => (showTriggerTip = true)}
        on:touchend={() => (showTriggerTip = false)}
        on:mouseleave={() => (showTriggerTip = false)}
        on:mouseenter={() => (showTriggerTip = true)}
    >
        <RoundedButton
            iconPath="icons/button/trigger.svg"
            size={8}
            on:click={handleTrigger}
        />
        <Tooltip
            text={tr('automations.buttons.trigger')}
            position="top"
            show={showTriggerTip}
        />
    </div>
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
                    <p>{tr('automations.confirmDelete')}</p>
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
</div>

<style>
    #automation {
        background-color: #22164d;
    }
</style>
