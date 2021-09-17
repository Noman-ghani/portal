<template>
    <b-form-checkbox @change="change" :checked="String(this.checked_value) === String(this.value)">
        <slot />
    </b-form-checkbox>
</template>
<script>
    export default {
        props: {
            value: {},
            checked_value: {},
            unchecked_value: {}
        },
        methods: {
            change(bool) {
                this.$emit("input", bool === true ? this.checked_value : this.unchecked_value)
            }
        }
    }
</script>
<style scoped lang="scss">
    ::v-deep .custom-control-label {
        font-size: 17px;
        // color: $input-color;
        padding-left: 10px;
        cursor: pointer;
        &:before {
            width: 24px;
            height: 24px;
            top: 0;
        }
        &:after {
            width: 24px;
            height: 24px;
            top: 0;
        }
    }
</style>