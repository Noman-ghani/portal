<template>
    <b-modal ref="modal" v-bind="$attrs" no-close-on-esc no-close-on-backdrop ok-only ok-title="Close" body-class="p-0" hide-header @hidden="itemSelected = componentToShow; $emit('closed')">
        <template v-if="!itemSelected">
            <b-link @click="itemSelected = item" v-for="item, idx in items" v-bind:key="idx"  :class="{'d-block': true, 'theme-color': true, 'font-size-17': true, 'font-weight-700': true, 'p-4': true, 'border-top': idx > 0}">
                <b-icon-caret-right-fill class="mr-1" />
                {{item}}
            </b-link>
        </template>
        <services v-if="itemSelected && itemSelected.toLowerCase() === 'services'" :url-params="serviceUrlParams" v-on:selected="onItemSelected('service', $event)" />
        <products v-if="itemSelected && itemSelected.toLowerCase() === 'products'" :url-params="productUrlParams" v-on:selected="onItemSelected('product', $event)" />
        <deals v-if="itemSelected && itemSelected.toLowerCase() === 'deals'" :url-params="dealUrlParams" v-on:selected="onItemSelected('deal', $event)"></deals>
        <branches v-if="itemSelected && itemSelected.toLowerCase() === 'branches'" :branch-id="branchId" v-on:selected="onItemSelected('branch', $event)"></branches>
    </b-modal>
</template>
<script>
    import Services from "./services.vue"
    import Products from "./products.vue"
    import Deals from "./deals.vue"
    import Branches from "./branches.vue"

    export default {
        props: {
            items: {
                default: function () {
                    return ["services", "products", "deals", "branches"]
                }
            },
            componentToShow: {
                type: String,
                default: null
            },
            productUrlParams: {
                type: Object
            },
            serviceUrlParams: {
                type: Object
            },
            dealUrlParams: {
                type: Object
            }
        },
        components: {
            Services,
            Products,
            Deals,
            Branches
        },
        data: function () {
            return {
                itemSelected: this.componentToShow ?? null
            }
        },
        methods: {
            onItemSelected: function (type, data) {
                this.$emit("selected", { type: type, data: data })
            }
        }
    }
</script>
<style lang="scss" scoped>
::v-deep .modal-body{
    a{
        text-transform: capitalize;
    }
}
</style>