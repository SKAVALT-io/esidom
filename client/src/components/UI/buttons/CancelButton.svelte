<script>
    import { tr } from '../../../utils/i18nHelper';

    import OutlineButton from './OutlineButton.svelte';
</script>

<OutlineButton
    text={tr('buttons.cancel')}
    backGroundColor={'bg-red-700'}
    on:click
/>
