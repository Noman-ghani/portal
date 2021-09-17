<template>
    <overlay :show="showLoader" full-height-with-heading class="centralized">
        <template v-if="!showLoader">
            <heading-with-back :back-link-to="{name: 'inventory.products'}">
                <template #title>{{product.name}} (Available Qty: {{product.stock_on_hand}})</template>
                <template #right>
                    <router-link class="btn btn-outline-primary" :to="{name: 'inventory.stock.increase', params: {id: $route.params.id}}">+ Stock</router-link>
                    <router-link class="btn btn-outline-primary ml-3 mr-3" :to="{name: 'inventory.stock.decrease', params: {id: $route.params.id}}">- Stock</router-link>
                    <router-link class="btn btn-primary" :to="{name: 'inventory.products.edit', params: {id: $route.params.id}}">Edit Product</router-link>
                </template>
            </heading-with-back>
            <overlay :show="showStockLoader">
                <template v-if="!showStockLoader">
                    <template v-if="stockHistoryList.length">
                        <b-card v-for="stockHistoryRow, idx in stockHistoryList" v-bind:key="stockHistoryRow.id" :class="{'d-flex': true, 'p-4': true, 'mt-3': idx > 0}" no-body>
                            <div class="d-flex flex-grow-1 align-items-center justify-content-between">
                                <div class="d-flex">
                                    <div v-if="stockHistoryRow.action === '+'" class="d-flex align-items-center bg-success rounded-circle p-2 mr-3">
                                        <b-icon-arrow-up font-scale="1.8" style="color: #FFFFFF"></b-icon-arrow-up>
                                    </div>
                                    <div v-if="stockHistoryRow.action === '-'" class="d-flex align-items-center bg-danger rounded-circle p-2 mr-3">
                                        <b-icon-arrow-down font-scale="1.8" style="color: #FFFFFF"></b-icon-arrow-down>
                                    </div>
                                    <div class="d-flex flex-column">
                                        <p class="m-0 font-size-17 font-weight-700">{{stockHistoryRow.text}}</p>
                                        <p class="m-0 sub-color">{{stockHistoryRow.description}}</p>
                                    </div>
                                </div>
                                <div class="d-flex flex-column">
                                    <p class="m-0 sub-color">{{stockHistoryRow.branch.name}}</p>
                                    <p class="m-0 sub-color">{{$helpers.formatDateTime(stockHistoryRow.created_at)}}</p>
                                </div>
                            </div>
                        </b-card>
                    </template>
                    <no-data class="mt-5" v-else>
                        <img src="@/assets/images/inventory.svg" />
                        <h2>Stock history not found</h2>
                        <p>We could not find any stock history related to this product. Add stock increase / decrease record.</p>
                    </no-data>
                </template>
            </overlay>
        </template>
        <router-view></router-view>
    </overlay>
</template>
<script>
    import Overlay from "../../helpers/overlay.vue"
    import HeadingWithBack from "../../heading-with-back.vue"
    import NoData from "../../no-data.vue"

    export default {
        components: {
            Overlay,
            HeadingWithBack,
            NoData
        },
        data: function () {
            return {
                showLoader: true,
                showStockLoader: false,
                product: {},
                stockHistoryList: []
            }
        },
        created: async function () {
            const productResponse = await this.$http.get("inventory/products/" + this.$route.params.id)
            this.product = productResponse.data
            
            await this.stockHistory()
            
            this.showLoader = false
        },
        methods: {
            stockHistory: async function () {
                this.showStockLoader = true
                const stockHistoryResponse = await this.$http.get("inventory/products/stocks/" + this.$route.params.id)
                this.stockHistoryList = stockHistoryResponse.data
                this.showStockLoader = false
            }
        },
        watch: {
            $route: {
                handler: function (route) {
                    if (route.params.reload) {
                        this.stockHistory()
                    }
                }
            }
        }
    }
</script>