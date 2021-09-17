<template>
    <overlay :show="showLoader">
        <template v-if="!showLoader">
            <div class="p-4 border-bottom">
                <search-field>
                    <b-form-input autofocus autocomplete="off" v-model="searchQuery" placeholder="Search for products here ..." />
                </search-field>
            </div>
            <div v-if="categoriesList.length" class="scrollable">
                <ul class="m-0">
                    <li @click="selectedCategory = categoryRow" v-for="categoryRow, idx in categoriesList" v-bind:key="'category-' + categoryRow.id" :class="{ 'd-flex': true, 'flex-column': true, 'border-top': idx > 0 }">
                        <p class="m-0 p-4 font-size-20 font-weight-800">
                            <b-icon-card-list class="mr-2" />
                            {{categoryRow.name}}
                        </p>
                        <ul class="m-0">
                            <li @click="$emit('selected', productRow)" v-for="productRow in categoryRow.products" v-bind:key="productRow.id" class="p-4 d-flex align-items-center justify-content-between border-top pointer" style="border-left: 6px solid rgb(165, 223, 248)">
                                <div>
                                    <p class="m-0 font-size-17 font-weight-700">
                                        {{productRow.name}}
                                    </p>
                                    <p class="m-0 sub-color">
                                        Brand: {{productRow.brand.name}}
                                    </p>
                                </div>
                                <div v-if="productRow.special_price > 0" class="d-flex flex-column text-right">
                                    <p class="m-0 font-size-17 font-weight-700">
                                        {{$store.getters.user.business.country.currency}} {{productRow.special_price | currency}}
                                    </p>
                                    <del class="font-size-17 sub-color">
                                        {{$store.getters.user.business.country.currency}} {{productRow.retail_price | currency}}
                                    </del>
                                </div>
                                <p v-else class="m-0 font-size-17 font-weight-700">
                                    {{$store.getters.user.business.country.currency}} {{productRow.retail_price | currency}}
                                </p>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <no-data class="mt-5 mb-5" v-else>
                <img src="@/assets/images/inventory.svg" />
                <h2>No Results Found</h2>
                <p>We could not find any results based on your search.</p>
            </no-data>
        </template>
    </overlay>
</template>
<script>
    import Overlay from "./overlay"
    import NoData from "./no-data.vue"
    import SearchField from "./search-field"

    export default {
        components: {
            Overlay,
            NoData,
            SearchField
        },
        props: {
            urlParams: {}
        },
        data: function () {
            return {
                showLoader: true,
                products: [],
                selectedCategory: null,
                searchQuery: null
            }
        },
        created: function () {
            this.$http.get("inventory/products", {params: this.urlParams})
            .then(categories => {
                this.showLoader = false
                this.categories = categories.data
            })
        },
        computed: {
            categoriesList: function () {
                if (this.categories.length) {
                    const searchQuery = this.searchQuery
                    if (searchQuery) {
                        return this.categories.filter(categoryRow => {
                            if (
                                categoryRow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                categoryRow.products.filter(productRow => productRow.name.toLowerCase().includes(searchQuery.toLowerCase())).length
                            ) {
                                return true
                            }

                            return false
                        })
                    }

                    return this.categories
                }

                return []
            }
        }
    }
</script>
<style scoped lang="scss">
    .scrollable {
        max-height: calc(100vh - 237px);
        overflow-y: scroll;
    }
</style>