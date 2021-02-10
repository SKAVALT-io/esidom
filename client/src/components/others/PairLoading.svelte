<script>
</script>

<div class="container m-0 p-0 w-screen h-2/3 flex justify-center items-center">
    <div
        class="loader flex relative text-center align-middle bg-transparent p-40"
    >
        <span class="circle animate-move" />
        <span class="circle animate-move" />
        <span class="circle animate-move" />
        <span class="circle animate-move" />
        <span class="circle animate-jump" />
    </div>
</div>

<style>
    .container {
        background-color: #120639;
        border-color: white;
        border-width: 2px;
    }

    .circle {
        display: block;
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50%;
        margin: 0 5px;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
    }
</style>
