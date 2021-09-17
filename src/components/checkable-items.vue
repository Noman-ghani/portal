<template>
    <b-form-checkbox @change="$emit('input', $event)" :value="value" class="c-icon-wrap">
        <span v-if="'svg' in $slots" class="d-flex align-items-center justify-content-center c-icon">
            <slot name="svg" />
        </span>
        <div class="d-flex flex-column flex-wrap pt-2">
            <slot name="content" />
        </div>
    </b-form-checkbox>
</template>
<script>
    export default {
        props: {
            value: {}
        }
    }
</script>
<style scoped lang="scss">
    ::v-deep .custom-control-label {
        font-size: 17px;
        padding-left: 15px;
        cursor: pointer;
        &:before {
            width: 24px;
            height: 24px;
            top: 18px;
        }
        &:after {
            width: 24px;
            height: 24px;
            top: 18px;
        }
    }
    ::v-deep .custom-control-input {
        margin-top: 18px;
    }
    .c-icon-wrap {
        .c-icon {
            width: 64px;
            height: 64px;
            min-width: 64px;
            min-height: 64px;
            float: left;
            margin: 0 20px 0 5px;
            background: #dce1ff;
            border-radius: 10px;
            &.first-letter {
                border-radius: 50%;
                text-transform: uppercase;
                font-size: 24px;
                font-weight: 800;
                color: var(--primary);
            }
        }
    }
    ::v-deep svg {
        width: 40px;
        height: 40px;
        fill: #0C56C9;
    }
</style>