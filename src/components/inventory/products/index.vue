<template>
    <div class="centralized">
        <heading-with-back v-if="products.length || searchQuery">
            <template #right>
                <router-link :to="{name: 'inventory.products.add'}" class="btn btn-primary">New Product</router-link>
            </template>
        </heading-with-back>
        <overlay :show="showLoader" full-height-with-heading-and-submenus>
            <template v-if="!showLoader">
                <template v-if="products.length">
                    <div class="service-row mt-5" v-for="category in products" v-bind:key="category.id">
                        <div class="d-flex align-items-center justify-content-between ml-4 mr-4">
                            <h3 class="font-size-24 font-weight-800 mb-4">{{category.name}}</h3>
                            <dropdown variant="transparent" right no-caret class="service-dropdown">
                                <b-dropdown-item :to="{name: 'inventory.products.add', params: {category : category.id}}">Add New Product</b-dropdown-item>
                            </dropdown>
                        </div>
                        <div v-if="category.products.length" class="bg-white border">
                            <div v-for="product in category.products" v-bind:key="product.id" v-on:click="$router.push({name: 'inventory.products.edit', params: {id: product.id}})" class="p-3 border-bottom pointer">
                                <div :class="{'d-flex': true, 'flex-wrap' : $screen.width <= 620}">
                                    <div :class="{'w-100' : $screen.width <= 620}" class="flex-grow-1">
                                        <p class="m-0 font-size-17 font-weight-700">{{product.name}}</p>
                                        <p class="m-0 sub-color">{{product.brand.name}}</p>
                                    </div>
                                    <div :class="{'w-100' : $screen.width <= 620, 'text-right ml-5' : $screen.width > 620}" class="flex-grow-0 sub-color font-size-17 min-width">
                                        <del v-if="product.special_price > 0">
                                            {{$store.getters.user.business.country.currency}}
                                            {{product.retail_price | currency}}
                                        </del>
                                    </div>
                                    <div :class="{'w-100 text-left' : $screen.width <= 620, 'text-right ml-5' : $screen.width > 620}" class="flex-grow-0 font-size-17 font-weight-700 min-width">
                                        <template v-if="product.special_price > 0">
                                            {{$store.getters.user.business.country.currency}}
                                            {{product.special_price | currency}}
                                        </template>
                                        <template v-else>
                                            {{$store.getters.user.business.country.currency}}
                                            {{product.retail_price | currency}}
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <no-data v-else>
                    <template v-if="searchQuery">
                        <img src="@/assets/images/inventory.svg" />
                        <h2>No results found</h2>
                        <p>We could not find any results based on your search.</p>
                        <b-link @click="searchQuery = ''; $router.push({name: 'inventory.products', params: {reload: true}})" class="btn btn-primary w-100">Back to Products</b-link>
                    </template>
                    <template v-else>
                        <img src="@/assets/images/inventory.svg" />
                        <h2>Add New Products</h2>
                        <p>Have you got stuff you want to sell? No sweat - you can add your retail products here and sell them with an existing appointment or as one-off items. Too easy!</p>
                        <router-link :to="{name: 'inventory.products.add'}" class="btn btn-primary w-100 d-block">New Product</router-link>
                    </template>
                </no-data>
            </template>
        </overlay>
    </div>
</template>
<script>
    import Overlay from "../../helpers/overlay.vue"
    import Dropdown from "../../helpers/dropdown.vue"
    import HeadingWithBack from "../../heading-with-back.vue"
    import NoData from "../../no-data.vue"
    
    export default {
        components: {
            Overlay,
            Dropdown,
            HeadingWithBack,
            NoData
        },
        data: function () {
            return {
                showLoader: true,
                searchQuery: this.$route.query.search,
                products: []
            }
        },
        created: function () {
            this.$http.get("inventory/products", {params: {group_by: "category_hierarchy"}})
            .then(products => {
                this.products = products.data
                this.showLoader = false
            })
        }
    }
</script>
<style lang="scss" scoped>
    .service-row {
        .min-width {
            min-width: 130px;
        }
    }
    ::v-deep .service-dropdown {
        .btn {
            padding: 0;
            box-shadow: none;
        }
    }
</style>