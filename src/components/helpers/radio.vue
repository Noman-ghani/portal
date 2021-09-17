<template>
    <b-form-radio v-bind="$attrs" v-bind:checked="checked" @change="$emit('change', $event)">
        <slot />
    </b-form-radio>
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
    .custom-radio {
        &.b-custom-control-lg {
            font-size: 17px;
            ::v-deep .custom-control-label {
                cursor: pointer;
                padding-top: 2px;
                padding-left: 2px;
                &:before {
                    width: 20px;
                    height: 20px;
                }
                &:after {
                    width: 20px;
                    height: 20px;
                }
            }
        }
    }
</style>