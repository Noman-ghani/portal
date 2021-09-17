<template>
    <div class="centralized">
        <heading-with-back v-if="suppliers.length || searchQuery">
            <template #left>
                <search-field>
                    <b-form-input autocomplete="off" v-model="searchQuery" placeholder="Search by supplier name" />
                </search-field>
            </template>
            <template #right>
                <router-link :to="{name: 'inventory.suppliers.add'}" class="btn btn-primary">Add Supplier</router-link>
            </template>
        </heading-with-back>
        <overlay :show="showLoader" full-height-with-heading-and-submenus>
            <template v-if="!showLoader">
                <b-card v-if="suppliers.length" no-body>
                    <b-card-body class="p-0">
                        <router-link v-for="supplier, idx in suppliers" v-bind:key="supplier.id" :to="{name: 'inventory.suppliers.edit', params: {id: supplier.id, data: supplier}}" :class="{'border-top': idx > 0, 'd-flex': true, 'align-items-center': true, 'justify-content-between': true, 'p-4': true, 'theme-color': true}">
                            <div class="d-flex flex-column">
                                <p class="m-0 font-size-17 font-weight-700">{{supplier.name}}</p>
                                <span class="sub-color">Products Assigned: {{supplier.products.length}}</span>
                            </div>
                        </router-link>
                    </b-card-body>
                </b-card>
                <no-data v-else>
                    <template v-if="searchQuery">
                        <img src="@/assets/images/inventory.svg" />
                        <h2>No results found</h2>
                        <p>We could not find any results based on your search.</p>
                        <b-link @click="searchQuery = ''; $router.push({name: 'inventory.suppliers', params: {reload: true}})" class="btn btn-primary w-100">Back to Suppliers</b-link>
                    </template>
                    <template v-else>
                        <img src="@/assets/images/inventory.svg" />
                        <h2>Add Product Suppliers</h2>
                        <p>Setup your product suppliers here, to keep track of details needed for purchase orders.</p>
                        <router-link :to="{name: 'inventory.suppliers.add'}" class="btn btn-primary w-100 d-block">New Supplier</router-link>
                    </template>
                </no-data>
            </template>
        </overlay>
    </div>
</template>
<script>
    import HeadingWithBack from "../../heading-with-back.vue"
    import Overlay from "../../helpers/overlay.vue"
    import NoData from "../../no-data.vue"
    import SearchField from "../../search-field.vue"
    
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
                suppliers: []
            }
        },
        created: function () {
            this.$http.get("inventory/suppliers?with-products&with-phone-country")
            .then(suppliers => {
                this.suppliers = suppliers.data
                this.showLoader = false
            })
        }
    }
</script>