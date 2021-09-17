<template>
    <overlay :show="showLoader" full-height-with-heading>
        <template v-if="!showLoader">
            <router-link :to="{name: 'analytics.index'}"><b-icon-arrow-left></b-icon-arrow-left> Reports</router-link>
            <p class="mt-2 mb-3 font-size-24 font-weight-800">Finances Summary</p>
            <b-row>
                <b-col md="6" :class="{'mb-3': $screen.width < 768}">
                    <div class="form-control d-flex align-items-center" style="max-width: 350px;">
                        <b-icon-calendar-fill class="mr-2"></b-icon-calendar-fill>
                        <date-range-picker @update="fetchData()" control-container-class="" :locale-data="{firstDay: 1, format: 'mmmm dd, yyyy'}" show-dropdowns v-model="form.dateRange"></date-range-picker>
                    </div>
                </b-col>
                <b-col md="6" class="d-flex">
                    <b-button v-b-toggle.filters-sidebar variant="transparent" :class="{'btn-with-shadow' : true, 'ml-auto': $screen.width >= 768}">
                        Filters
                        <span class="svg-wrapper-20 ml-1">
                            <b-icon-filter></b-icon-filter>
                        </span>
                    </b-button>
                </b-col>
            </b-row>
            <overlay :show="dataLoader" full-height-with-heading-and-submenus>
                <template v-if="!dataLoader">
                    <b-row class="mt-4">
                        <b-col md="6" :class="{'mb-4': $screen.width < 768}">
                            <b-card>
                                <template #header>
                                    <h2>Sales</h2>
                                </template>
                                <div class="report-table">
                                    <div class="d-flex justify-content-between">
                                        <p class="m-0">Gross Sales</p>
                                        <p class="m-0">{{$store.getters.user.business.country.currency}} {{salesData.gross_sales | currency}}</p>
                                    </div>
                                    <div class="d-flex justify-content-between mt-3 mb-3">
                                        <p class="m-0">Discounts</p>
                                        <p class="m-0">{{$store.getters.user.business.country.currency}} {{salesData.discounts | currency}}</p>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <p class="m-0">Refunds</p>
                                        <p class="m-0">{{$store.getters.user.business.country.currency}} {{salesData.refunds | currency}}</p>
                                    </div>
                                    <div class="d-flex justify-content-between border-top mt-3 pt-3 font-weight-700">
                                        <p class="m-0">Net Sales</p>
                                        <p class="m-0">{{$store.getters.user.business.country.currency}} {{salesData.net_sales | currency}}</p>
                                    </div>
                                    <div class="d-flex justify-content-between mt-3">
                                        <p class="m-0"><router-link :to="{name: 'analytics.taxes-summary', query: query}" target="_blank">Taxes</router-link></p>
                                        <p class="m-0">{{$store.getters.user.business.country.currency}} {{salesData.taxes | currency}}</p>
                                    </div>
                                    <div class="d-flex justify-content-between border-top mt-3 pt-3 font-weight-800">
                                        <p class="m-0">Total Sales</p>
                                        <p class="m-0">{{$store.getters.user.business.country.currency}} {{salesData.total_sales | currency}}</p>
                                    </div>
                                </div>
                            </b-card>
                        </b-col>
                        <b-col md="6">
                            <b-card>
                                <template #header>
                                    <h2>Payments</h2>
                                </template>
                                <div class="report-table">
                                    <div v-for="payment, idx in paymentsData.items" v-bind:key="'payment-method-' + idx" class="d-flex justify-content-between mb-3">
                                        <p class="m-0">{{payment.payment_method}}</p>
                                        <p class="m-0">{{$store.getters.user.business.country.currency}} {{payment.total_payments | currency}}</p>
                                    </div>
                                    <div class="d-flex justify-content-between border-top mt-3 pt-3 font-weight-800">
                                        <p class="m-0"><router-link :to="{name: 'analytics.payments-summary', query: query}" target="_blank">Total Payments</router-link></p>
                                        <p class="m-0">{{$store.getters.user.business.country.currency}} {{paymentsData.total_payments | currency}}</p>
                                    </div>
                                </div>
                            </b-card>
                        </b-col>
                    </b-row>
                </template>
            </overlay>
            <b-sidebar id="filters-sidebar" backdrop-variant="dark" no-close-on-backdrop right backdrop shadow>
                <template #default="{hide}">
                    <div class="p-3">
                        <b-form-group label="Locations" label-for="locations">
                            <b-form-select :options="branches" value-field="id" text-field="name" v-model="form.branch_id">
                                <template #first>
                                    <b-form-select-option :value="null">All Locations</b-form-select-option>
                                </template>
                            </b-form-select>
                        </b-form-group>
                        <div class="d-flex">
                            <b-button @click="reset(); fetchData(); hide()" class="flex-basis-50 mr-1 box-shadow with-border" variant="transparent">Clear</b-button>
                            <b-button @click="fetchData(); hide()" class="flex-basis-50 ml-1" variant="primary">Apply</b-button>
                        </div>
                    </div>
                </template>
            </b-sidebar>
        </template>
    </overlay>
</template>
<script>
    import DateRangePicker from "vue2-daterange-picker"
    import moment from "moment"
    import Overlay from "@/components/helpers/overlay.vue"

    export default {
        components: {
            DateRangePicker,
            Overlay
        },
        data: function () {
            return {
                showLoader: true,
                dataLoader: true,
                branches: [],
                salesData: {
                    gross_sales: 0,
                    discounts: 0,
                    refunds: 0,
                    taxes: 0,
                    net_sales: 0,
                    total_sales: 0
                },
                paymentsData: {
                    items: [],
                    total_payments: 0
                },
                form: {
                    branch_id: this.$route.query.branch_id ?? null,
                    dateRange: {
                        startDate: this.$route.query.start_date ?? moment().startOf("month"),
                        endDate: this.$route.query.end_date ?? moment().endOf("month")
                    }
                }
            }
        },
        created: async function () {
            const branchesPromise = new Promise((resolve) => { this.$http.get("branches").then(response => resolve(response)) })
            let [branchesResponse] = await Promise.all([branchesPromise])
            this.branches = branchesResponse.data
            this.showLoader = false
            
            this.fetchData()
        },
        methods: {
            reset: function () {
                this.form = {
                    branch_id: null,
                    dateRange: {
                        startDate: moment().startOf("month"),
                        endDate: moment().endOf("month")
                    }
                }
            },
            fetchData: function () {
                history.pushState({}, null, this.$route.path + '?' + new URLSearchParams(this.query).toString())
                
                this.dataLoader = true
                this.$http.get("reports/finances-summary", {params: this.query})
                .then(response => {
                    this.salesData = response.data.sales
                    this.paymentsData.items = response.data.payments

                    this.salesData.net_sales = (parseFloat(this.salesData.gross_sales) - parseFloat(this.salesData.discounts) - parseFloat(this.salesData.refunds))
                    this.salesData.total_sales = parseFloat(this.salesData.net_sales) + parseFloat(this.salesData.taxes)

                    this.paymentsData.total_payments = 0
                    this.paymentsData.items.forEach(paymentData => {
                        this.paymentsData.total_payments = parseFloat(this.paymentsData.total_payments) + parseFloat(paymentData.total_payments)
                    })

                    this.dataLoader = false
                })
            }
        },
        computed: {
            query: function () {
                let query = {...this.form}
                query.start_date = moment(query.dateRange.startDate).format("YYYY-MM-DD")
                query.end_date = moment(query.dateRange.endDate).format("YYYY-MM-DD")
                delete query.dateRange
                Object.keys(query).forEach((k) => query[k] == null && delete query[k])

                return query
            }
        }
    }
</script>
<style lang="scss" scoped>
::v-deep .vue-daterange-picker{
    font-size: 12px;
    line-height: 1.9;
}
::v-deep .card-body{
    overflow: auto;
    @media (max-width: 380px) {
        .report-table{
            width: 380px;
        }
    }
}
</style>