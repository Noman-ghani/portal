<template>
    <div class="centralized">
        <heading-with-back v-if="categories.length || searchQuery">
            <template #left>
                <search-field class="mb-3">
                    <b-form-input autocomplete="off" v-debounce:400ms.lock="searchForCategories" v-model="searchQuery" placeholder="Search by category name" />
                </search-field>
            </template>
            <template #right>
                <router-link :to="{name: 'inventory.categories.add'}" class="btn btn-primary">New Category</router-link>
            </template>
        </heading-with-back>
        <overlay :show="showLoader" full-height-with-heading-and-submenus>
            <template v-if="!showLoader">
                <b-card v-if="categories.length" no-body>
                    <b-card-body class="p-0">
                        <router-link v-for="category, idx in categories" v-bind:key="category.id" :to="{name: 'inventory.categories.edit', params: {id: category.id, data: category}}" :class="{'border-top': idx > 0, 'd-flex': true, 'align-items-center': true, 'justify-content-between': true, 'p-4': true, 'theme-color': true}">
                            <div class="d-flex flex-column">
                                <p class="m-0 font-size-17 font-weight-700">{{category.name}}</p>
                                <span class="sub-color">Products Assigned: {{category.products.length}}</span>
                            </div>
                        </router-link>
                    </b-card-body>
                </b-card>
                <no-data v-else>
                    <template v-if="searchQuery">
                        <img src="@/assets/images/inventory.svg" />
                        <h2>No results found</h2>
                        <p>We could not find any results based on your search.</p>
                        <b-link @click="searchQuery = ''; $router.push({name: 'inventory.categories', params: {reload: true}})" class="btn btn-primary w-100">Back to Categories</b-link>
                    </template>
                    <template v-else>
                        <img src="@/assets/images/inventory.svg" />
                        <h2>Add Product Categories</h2>
                        <p>Setup your category names here, and link them to your products. Too easy!</p>
                        <router-link :to="{name: 'inventory.categories.add'}" class="btn btn-primary w-100 d-block">New Category</router-link>
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
                categories: {}
            }
        },
        created: function () {
            this.getCategories()
        },
        watch: {
            $route: {
                handler: function (route) {
                    if (route.params.reload) {
                        this.getCategories()
                    }
                }
            }
        },
        methods: {
            searchForCategories: function () {
                this.$router.push({name: "inventory.categories", params: {reload: true}, query: {search: this.searchQuery}})
            },
            getCategories: function () {
                this.showLoader = true
                this.$http.get("inventory/categories")
                .then(categories => {
                    this.categories = categories.data
                    this.showLoader = false
                })
            }
        }
    }
</script>