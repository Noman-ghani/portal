<template>
    <div class="centralized">
        <heading-with-back v-if="brands.length || searchQuery">
            <template #left>
                <search-field class="mb-3">
                    <b-form-input autocomplete="off" v-debounce:400ms.lock="searchForBrands" v-model="searchQuery" placeholder="Search by brand name" />
                </search-field>
            </template>
            <template #right>
                <router-link :to="{name: 'inventory.brands.add'}" class="btn btn-primary">New Brand</router-link>
            </template>
        </heading-with-back>
        <overlay :show="showLoader" full-height-with-heading-and-submenus>
            <template v-if="!showLoader">
                <b-card v-if="brands.length" no-body>
                    <b-card-body class="p-0">
                        <router-link v-for="brand, idx in brands" v-bind:key="brand.id" :to="{name: 'inventory.brands.edit', params: {id: brand.id, data: brand}}" :class="{'border-top': idx > 0, 'd-flex': true, 'align-items-center': true, 'justify-content-between': true, 'p-4': true, 'theme-color': true}">
                            <div class="d-flex flex-column">
                                <p class="m-0 font-size-17 font-weight-700">{{brand.name}}</p>
                                <span class="sub-color">Products Assigned: {{brand.products.length}}</span>
                            </div>
                            <b-icon-caret-right-fill></b-icon-caret-right-fill>
                        </router-link>
                    </b-card-body>
                </b-card>
                <no-data v-else>
                    <template v-if="searchQuery">
                        <img src="@/assets/images/inventory.svg" />
                        <h2>No results found</h2>
                        <p>We could not find any results based on your search.</p>
                        <b-link @click="searchQuery = ''; $router.push({name: 'inventory.brands', params: {reload: true}})" class="btn btn-primary w-100">Back to Brands</b-link>
                    </template>
                    <template v-else>
                        <img src="@/assets/images/inventory.svg" />
                        <h2>Add Product Brands</h2>
                        <p>Setup your brand names here, and link them to your products. Too easy!</p>
                        <router-link :to="{name: 'inventory.brands.add'}" class="btn btn-primary w-100 d-block">New Brand</router-link>
                    </template>
                </no-data>
            </template>
        </overlay>
        <router-view></router-view>
    </div>
</template>
<script>
    import Vue from "vue"
    import VueDebounce from "vue-debounce"
    import HeadingWithBack from "../../heading-with-back.vue"
    import Overlay from "../../helpers/overlay.vue"
    import NoData from "../../no-data.vue"
    import SearchField from "../../search-field.vue"
    
    Vue.use(VueDebounce, {
        listenTo: "input"
    })
    
    export default {
        components: {
            Overlay,
            NoData,
            HeadingWithBack,
            SearchField
        },
        data: function () {
            return {
                showLoader: true,
                searchQuery: this.$route.query.search,
                brands: []
            }
        },
        created: function () {
            this.getBrands()
        },
        watch: {
            $route: {
                handler: function (route) {
                    if (route.params.reload) {
                        this.getBrands()
                    }
                }
            }
        },
        methods: {
            searchForBrands: function () {
                this.$router.push({name: "inventory.brands", params: {reload: true}, query: {search: this.searchQuery}})
            },
            getBrands: function () {
                this.showLoader = true
                this.$http.get("inventory/brands")
                .then(brands => {
                    this.brands = brands.data
                    this.showLoader = false
                })
            }
        }
    }
</script>