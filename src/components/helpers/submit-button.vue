<template>
    <b-button v-bind="$attrs" :variant="$attrs.variant ? $attrs.variant : 'primary'" ref="button" :disabled="displayLoader">
        <div v-if="displayLoader" class="loading-animation-wrapper">
            <div class="animation-button"></div>
            <div class="animation-button"></div>
            <div class="animation-button"></div>
        </div>
        <template v-else>
            <slot v-if="$slots.default" />
            <span v-else>Save</span>
        </template>
    </b-button>
</template>
<script>
    export default {
        data: function () {
            return {
                displayLoader: false
            }
        }
    }
</script>
<style scoped lang="scss">
    .btn {
        min-width: 91px;
        min-height: 49px;
    }
    .loading-animation-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        .animation-button {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin: 0 6px;
            -webkit-animation: animation_keyframes 0.7s 0s infinite steps(25);
            animation: animation_keyframes 0.7s 0s infinite steps(25);
            background-color: #ffffff;
            &:nth-child(2n-1) {
                -webkit-animation-delay: -0.35s;
                animation-delay: -0.35s;
            }
        }
    }

    @-webkit-keyframes animation_keyframes {
        50% {
            opacity: 0.2;
            transform: scale(0.75);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    @keyframes animation_keyframes {
        50% {
            opacity: 0.2;
            transform: scale(0.75);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
</style>