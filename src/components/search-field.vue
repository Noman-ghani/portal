<template>
    <b-form-group :class="{'m-0': true, 'with-max-width': withMaxWidth}">
        <slot />
        <b-icon-search />
    </b-form-group>
</template>
<script>
    export default {
        props: {
            withMaxWidth: {
                type: Boolean,
                default: false
            }
        }
    }
</script>
<style scoped lang="scss">
    .form-group {
        position: relative;
        .bi-search {
            position: absolute;
            left: 20px;
            max-height: 15px;
            top: 17px;
        }
    }
    ::v-deep .form-control {
        padding-left: 3rem;
         @media only screen and (max-width: 767px) {
            max-width: 100%;
        }
    }
    .with-max-width {
        ::v-deep .form-control {
            max-width: 380px;
        }
    }
</style>