<script>
    export let isError = Math.random() > 0.5;
    // console.log('isError', isError);
</script>

<div>
    <div id="all" class="grid grid-cols-5" class:error={isError}>
        <div
            id="img"
            class="col-span-2 rounded-xl rounded-r-none flex items-center px-5"
        >
            {#if !isError}
                <slot name="img">
                    <img
                        class="object-scale-down"
                        alt=""
                        src="https://via.placeholder.com/350x150"
                    />
                </slot>
            {:else}Data unavailable{/if}
        </div>
        <div
            id="data"
            class="col-span-3 rounded-xl rounded-l-none flex items-center px-3 py-8"
        >
            {#if !isError}
                <slot name="data" class="">Placeholder</slot>
            {:else}Data unavailable{/if}
        </div>
    </div>

    <!-- <div class="bg-red-200 flex rounded-xl">
        <div class="flex rounded-xl rounded-r-none ">
            <div class="flex-none w-20 relative mt-2">
                <img
                    class="object-contain md:object-scale-down"
                    alt=""
                    src="https://via.placeholder.com/350x150"
                />
            </div>
        </div>
        <form class="flex-auto p-6">
            <div class="flex flex-wrap">Wesh</div>
        </form>
    </div> -->
</div>

<style lang="scss">
    #all {
        height: 120px;

        #img {
            background-color: #7ea874;
        }

        #data {
            background-color: #5e9251;
        }
    }

    #all.error {
        #img {
            background-color: #b45561;
        }

        #data {
            background-color: #a12b39;
        }
    }

    img {
        // width: 80px;
        // height: 80px;
    }
</style>
