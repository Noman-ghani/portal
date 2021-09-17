<template>
    <b-overlay v-bind="$attrs" :class="{'min-height': !isField && $attrs.show, 'full-height': $attrs.show && fullHeight, 'full-height-with-heading': $attrs.show && fullHeightWithHeading, 'full-height-with-heading-and-submenus': $attrs.show && fullHeightWithHeadingAndSubmenus}">
        <template v-if="!$slots.overlay && !isField" #overlay>
            <div class="text-center">
                <b-spinner label="Spinning" style="width: 3rem; height: 3rem;"></b-spinner>
                <p class="mt-3 font-weight-bold font-size-17">Please wait while the system is loading your data.</p>
            </div>
        </template>
        <template v-else #overlay>
            <slot name="overlay"></slot>
        </template>
        <slot></slot>
    </b-overlay>
</template>
<script>
    export default {
        props: {
            isField: {
                type: Boolean,
                default: false
            },
            fullHeight: {
                type: Boolean,
                default: false
            },
            fullHeightWithHeading: {
                type: Boolean,
                default: false
            },
            fullHeightWithHeadingAndSubmenus: {
                type: Boolean,
                default: false
            }
        }
    }
</script>
<style scoped lang="scss">
    .min-height {
        min-height: 200px;
    }
    .full-height {
        height: calc(100vh - 71px);
    }
    .full-height-with-heading {
        height: calc(100vh - 201px);
    }
    .full-height-with-heading-and-submenus {
        height: calc(100vh - 241px);
    }
</style>