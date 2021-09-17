<template>
    <b-form-checkbox v-bind="$attrs" v-bind:checked="checked" @change="$emit('change', $event)">
        <slot />
    </b-form-checkbox>
</template>
<script>
    export default {
        model: {
            prop: "checked",
            event: "change"
        },
        props: {
            checked: {}
        }
    }
</script>
<style scoped lang="scss">
    .custom-checkbox {
        &.b-custom-control-lg {
            font-size: 17px;
            ::v-deep .custom-control-label {
                padding-top: 4px;
                padding-left: 10px;
                &:before {
                    width: 24px;
                    height: 24px;
                }
                &:after {
                    width: 24px;
                    height: 24px;
                }
            }
        }
    }
</style>