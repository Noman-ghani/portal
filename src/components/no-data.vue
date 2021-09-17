<template>
    <div class="no-data">
        <slot />
    </div>
</template>
<style scoped lang="scss">
    .no-data {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        max-width: 450px;
        margin: 0 auto;
        text-align: center;
        h2 {
            margin: 0 0 16px;
        }
        img,
        svg {
            max-width: 48px;
            max-height: 48px;
            margin-bottom: 16px;
        }
        p {
            font-size: 17px !important;
        }
        .btn {
            font-size: 17px !important;
        }
    }
</style>