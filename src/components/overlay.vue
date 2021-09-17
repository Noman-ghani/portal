<template>
    <b-overlay ref="b-overlay" variant="transparent" blur="5px" opacity="1" :class="{'overlay-loader': !isField, 'with-full-height': withFullHeight, 'with-min-height': !isField && !withHeading && show, 'with-heading': withHeading}" :show="show" rounded>
        <template v-if="!isField" #overlay>
            <div class="text-center loading-content">
                <div v-if="!$slots.overlay">
                    <b-spinner label="Spinning" style="width: 3rem; height: 3rem;"></b-spinner>
                    <p class="mt-3 font-weight-bold">Please wait while the system is loading your data.</p>
                </div>
                <slot name="overlay" v-else />
            </div>
        </template>
        <slot />
    </b-overlay>
</template>
<script>
    export default {
        props: {
            show: {
                type: Boolean,
                default: false
            },
            isField: {
                type: Boolean,
                default: false
            },
            withHeading: {
                type: Boolean,
                default: false
            },
            withFullHeight: {
                type: Boolean,
                default: false
            }
        }
    }
</script>
<style scoped lang="scss">
    .overlay-loader {
        &.with-min-height {
            height: 200px;
        }
        &.with-heading {
            height: calc(100vh - 231px)
        }
        &.with-full-height {
            height: calc(100vh - 71px)
        }
        .loading-content {
            p {
                font-size: 17px;
            }
        }
    }
</style>