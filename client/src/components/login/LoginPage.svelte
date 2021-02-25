<script>
    import InputBar from '../UI/bar/InputBar.svelte';
    import UserService from '../../services/userService';
    import toastService from '../../utils/toast';
    import { tr } from '../../utils/i18nHelper';

    let password = '';

    async function unlock(): Promise<void> {
        UserService.unlockFront(password).then((unlocked) => {
            if (unlocked) {
                window.location.reload();
            } else {
                toastService.toast('Mot de passe incorrect');
            }
        });
    }
</script>

<div
    class="min-h-screen flex items-center justify-center bg-esidom py-12 px-4 sm:px-6 lg:px-8"
>
    <div class="max-w-md w-full space-y-8">
        <div>
            <img class="mx-auto h-12 w-auto" src="logo-esidom.png" alt="logo" />
            <h2 class="mt-6 text-center text-3xl font-extrabold">
                {tr('app.name')}
            </h2>
        </div>
        <InputBar
            placeholder={tr('placeholder.password')}
            required={true}
            bind:input={password}
        />
        <div>
            <button
                on:click={() => unlock()}
                type="submit"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg
                        class="h-5 w-5 text-white group-hover:text-gray-200"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </span>
                {tr('buttons.unlock')}
            </button>
        </div>
    </div>
</div>
