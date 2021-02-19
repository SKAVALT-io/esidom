<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import BorderedButton from '../UI/buttons/BorderedButton.svelte';
    import CancelButton from '../UI/buttons/CancelButton.svelte';
    import { tr } from '../../utils/i18nHelper';

    import { step, reset } from './PairingStore.svelte';
    import config from '../../config/config';

    const deviceName = '';
</script>

<div class="flex flex-col space-y-3 ml-10 mr-10 justify-center items-center">
    <p class="max-w-lg md:max-w-xl">
        Félicitation, votre appareil
        <span class="text-blue-300">{deviceName}</span>
        a bien été rajouté au sein de votre réseau.
    </p>
</div>
