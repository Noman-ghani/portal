<template>
    <overlay :show="showLoader" full-height-with-heading>
        <template v-if="!showLoader">
            <router-link :to="{name: 'analytics.index'}"><b-icon-arrow-left></b-icon-arrow-left> Reports</router-link>
            <p class="mt-2 mb-3 font-size-24 font-weight-800">Staff Commission Summary</p>
            <b-row>
                <b-col md="6" :class="{'mb-3': $screen.width < 768}">
                    <div class="form-control d-flex align-items-center"  style="max-width: 350px;">
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
                    <p class="m-0 mt-4 font-size-24 font-weight-300">Commission by Staff</p>
                    <b-table class="mt-2 report-table1" responsive hover :items="commissionByStaff.items" :fields="commissionByStaff.fields">
                        <template #top-row>
                            <b-th>Total</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{commissionByStaff.totals.service_sales_total | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{commissionByStaff.totals.service_commission_total | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{commissionByStaff.totals.product_sales_total | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{commissionByStaff.totals.product_commission_total | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{commissionByStaff.totals.deal_sales_total | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{commissionByStaff.totals.deal_commission_total | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{commissionByStaff.totals.commission_total | currency}}</b-th>
                        </template>
                        <template #cell(service_sales_total)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.service_sales_total | currency}}
                        </template>
                        <template #cell(service_commission_total)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.service_commission_total | currency}}
                        </template>
                        <template #cell(product_sales_total)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.product_sales_total | currency}}
                        </template>
                        <template #cell(product_commission_total)="data">
                            <router-link v-if="data.item.product_commission_total > 0" :to="{name: 'analytics.staff-commission-detailed', query: detailedQuery(data.item.staff_id, 'product')}">{{$store.getters.user.business.country.currency}} {{data.item.product_commission_total | currency}}</router-link>
                            <template v-else>{{$store.getters.user.business.country.currency}} {{data.item.product_commission_total | currency}}</template>
                        </template>
                        <template #cell(deal_sales_total)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.deal_sales_total | currency}}
                        </template>
                        <template #cell(deal_commission_total)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.deal_commission_total | currency}}
                        </template>
                        <template #cell(commission_total)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.commission_total | currency}}
                        </template>
                    </b-table>
                    <p class="m-0 mt-4 font-size-24 font-weight-300">Commission by Service</p>
                    <b-table class="mt-2 report-table" responsive hover :items="commissionByService.items" :fields="commissionByService.fields">
                        <template #top-row>
                            <b-th>Total</b-th>
                            <b-th class="text-right w-15">{{commissionByService.totals.qty}}</b-th>
                            <b-th class="text-right w-15">{{$store.getters.user.business.country.currency}} {{commissionByService.totals.sales_amount | currency}}</b-th>
                            <b-th class="text-right w-15">{{$store.getters.user.business.country.currency}} {{commissionByService.totals.refund_amount | currency}}</b-th>
                            <b-th class="text-right w-15">{{$store.getters.user.business.country.currency}} {{commissionByService.totals.sales_total | currency}}</b-th>
                            <b-th class="text-right w-15">{{$store.getters.user.business.country.currency}} {{commissionByService.totals.commission_total | currency}}</b-th>
                        </template>
                        <template #cell(sales_amount)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.sales_amount | currency}}
                        </template>
                        <template #cell(refund_amount)="data">
                            - {{$store.getters.user.business.country.currency}} {{data.item.refund_amount | currency}}
                        </template>
                        <template #cell(sales_total)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.sales_total | currency}}
                        </template>
                        <template #cell(commission_total)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.commission_total | currency}}
                        </template>
                    </b-table>
                    <p class="m-0 mt-4 font-size-24 font-weight-300">Commission by Product</p>
                    <b-table class="mt-2 report-table" responsive hover :items="commissionByProduct.items" :fields="commissionByProduct.fields">
                        <template #top-row>
                            <b-th>Total</b-th>
                            <b-th class="text-right w-15">{{commissionByProduct.totals.qty}}</b-th>
                            <b-th class="text-right w-15">{{$store.getters.user.business.country.currency}} {{commissionByProduct.totals.sales_amount | currency}}</b-th>
                            <b-th class="text-right w-15">{{$store.getters.user.business.country.currency}} {{commissionByProduct.totals.refund_amount | currency}}</b-th>
                            <b-th class="text-right w-15">{{$store.getters.user.business.country.currency}} {{commissionByProduct.totals.sales_total | currency}}</b-th>
                            <b-th class="text-right w-15">{{$store.getters.user.business.country.currency}} {{commissionByProduct.totals.commission_total | currency}}</b-th>
                        </template>
                        <template #cell(sales_amount)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.sales_amount | currency}}
                        </template>
                        <template #cell(refund_amount)="data">
                            - {{$store.getters.user.business.country.currency}} {{data.item.refund_amount | currency}}
                        </template>
                        <template #cell(sales_total)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.sales_total | currency}}
                        </template>
                        <template #cell(commission_total)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.commission_total | currency}}
                        </template>
                    </b-table>
                    <p class="m-0 mt-4 font-size-24 font-weight-300">Commission by Deal</p>
                    <b-table class="mt-2 report-table" responsive hover :items="commissionByDeal.items" :fields="commissionByDeal.fields">
                        <template #top-row>
                            <b-th>Total</b-th>
                            <b-th class="text-right w-15">{{commissionByDeal.totals.qty}}</b-th>
                            <b-th class="text-right w-15">{{$store.getters.user.business.country.currency}} {{commissionByDeal.totals.sales_amount | currency}}</b-th>
                            <b-th class="text-right w-15">{{$store.getters.user.business.country.currency}} {{commissionByDeal.totals.refund_amount | currency}}</b-th>
                            <b-th class="text-right w-15">{{$store.getters.user.business.country.currency}} {{commissionByDeal.totals.sales_total | currency}}</b-th>
                            <b-th class="text-right w-15">{{$store.getters.user.business.country.currency}} {{commissionByDeal.totals.commission_total | currency}}</b-th>
                        </template>
                        <template #cell(sales_amount)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.sales_amount | currency}}
                        </template>
                        <template #cell(refund_amount)="data">
                            - {{$store.getters.user.business.country.currency}} {{data.item.refund_amount | currency}}
                        </template>
                        <template #cell(sales_total)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.sales_total | currency}}
                        </template>
                        <template #cell(commission_total)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.commission_total | currency}}
                        </template>
                    </b-table>
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
                        <b-form-group label="Staff" label-for="staff">
                            <b-form-select :options="staffs" v-model="form.staff_id">
                                <template #first>
                                    <b-form-select-option :value="null">All Staff</b-form-select-option>
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
                commissionByStaff: {
                    fields: [
                        { key: "staff" },
                        { key: "service_sales_total", thClass: "text-right", tdClass: "text-right" },
                        { key: "service_commission_total", thClass: "text-right", tdClass: "text-right" },
                        { key: "product_sales_total", thClass: "text-right", tdClass: "text-right" },
                        { key: "product_commission_total", thClass: "text-right", tdClass: "text-right" },
                        { key: "deal_sales_total", thClass: "text-right", tdClass: "text-right" },
                        { key: "deal_commission_total", thClass: "text-right", tdClass: "text-right" },
                        { key: "commission_total", thClass: "text-right", tdClass: "text-right" }
                    ],
                    items: [],
                    totals: {}
                },
                commissionByService: {
                    fields: [
                        { key: "service" },
                        { key: "qty", thClass: "text-right", tdClass: "text-right" },
                        { key: "sales_amount", thClass: "text-right", tdClass: "text-right" },
                        { key: "refund_amount", thClass: "text-right", tdClass: "text-right" },
                        { key: "sales_total", thClass: "text-right", tdClass: "text-right" },
                        { key: "commission_total", thClass: "text-right", tdClass: "text-right" },
                    ],
                    items: [],
                    totals: {}
                },
                commissionByProduct: {
                    fields: [
                        { key: "product" },
                        { key: "qty", thClass: "text-right", tdClass: "text-right" },
                        { key: "sales_amount", thClass: "text-right", tdClass: "text-right" },
                        { key: "refund_amount", thClass: "text-right", tdClass: "text-right" },
                        { key: "sales_total", thClass: "text-right", tdClass: "text-right" },
                        { key: "commission_total", thClass: "text-right", tdClass: "text-right" },
                    ],
                    items: [],
                    totals: {}
                },
                commissionByDeal: {
                    fields: [
                        { key: "deal" },
                        { key: "qty", thClass: "text-right", tdClass: "text-right" },
                        { key: "sales_amount", thClass: "text-right", tdClass: "text-right" },
                        { key: "refund_amount", thClass: "text-right", tdClass: "text-right" },
                        { key: "sales_total", thClass: "text-right", tdClass: "text-right" },
                        { key: "commission_total", thClass: "text-right", tdClass: "text-right" },
                    ],
                    items: [],
                    totals: {}
                },
                form: {
                    branch_id: this.$route.query.branch_id ?? null,
                    staff_id: this.$route.query.staff_id ?? null,
                    dateRange: {
                        startDate: this.$route.query.start_date ?? moment().startOf("month"),
                        endDate: this.$route.query.end_date ?? moment().endOf("month")
                    }
                }
            }
        },
        created: async function () {
            const branchesPromise = new Promise((resolve) => { this.$http.get("branches", {params: {"with-staff": 1}}).then(response => resolve(response)) })
            let [branchesResponse] = await Promise.all([branchesPromise])
            this.branches = branchesResponse.data
            this.showLoader = false
            
            this.fetchData()
        },
        methods: {
            reset: function () {
                this.form = {
                    branch_id: null,
                    staff_id: null,
                    dateRange: {
                        startDate: moment().startOf("month"),
                        endDate: moment().endOf("month")
                    }
                }
            },
            fetchData: function () {
                history.pushState({}, null, this.$route.path + '?' + new URLSearchParams(this.query).toString())

                this.dataLoader = true
                this.$http.get("reports/staff-commission-summary", {params: this.query})
                .then(response => {
                    this.commissionByStaff.items = response.data.byStaff
                    this.commissionByService.items = response.data.byService
                    this.commissionByProduct.items = response.data.byProduct
                    this.commissionByDeal.items = response.data.byDeal
                    
                    this.commissionByStaff.totals = {
                        service_sales_total: 0,
                        service_commission_total: 0,
                        product_sales_total: 0,
                        product_commission_total: 0,
                        deal_sales_total: 0,
                        deal_commission_total: 0,
                        commission_total: 0
                    }

                    this.commissionByService.totals = {
                        qty: 0,
                        sales_amount: 0,
                        refund_amount: 0,
                        sales_total: 0,
                        commission_total: 0
                    }

                    this.commissionByProduct.totals = {
                        qty: 0,
                        sales_amount: 0,
                        refund_amount: 0,
                        sales_total: 0,
                        commission_total: 0
                    }

                    this.commissionByDeal.totals = {
                        qty: 0,
                        sales_amount: 0,
                        refund_amount: 0,
                        sales_total: 0,
                        commission_total: 0
                    }
                    
                    this.commissionByStaff.items.map(item => {
                        item.commission_total = parseFloat(item.service_commission_total) + parseFloat(item.product_commission_total) + parseFloat(item.deal_commission_total)

                        this.commissionByStaff.totals.service_sales_total = parseFloat(this.commissionByStaff.totals.service_sales_total) + parseFloat(item.service_sales_total)
                        this.commissionByStaff.totals.service_commission_total = parseFloat(this.commissionByStaff.totals.service_commission_total) + parseFloat(item.service_commission_total)
                        this.commissionByStaff.totals.product_sales_total = parseFloat(this.commissionByStaff.totals.product_sales_total) + parseFloat(item.product_sales_total)
                        this.commissionByStaff.totals.product_commission_total = parseFloat(this.commissionByStaff.totals.product_commission_total) + parseFloat(item.product_commission_total)
                        this.commissionByStaff.totals.deal_sales_total = parseFloat(this.commissionByStaff.totals.deal_sales_total) + parseFloat(item.deal_sales_total)
                        this.commissionByStaff.totals.deal_commission_total = parseFloat(this.commissionByStaff.totals.deal_commission_total) + parseFloat(item.deal_commission_total)
                        this.commissionByStaff.totals.commission_total += item.commission_total
                    })

                    this.commissionByService.items.map(item => {
                        item.sales_total = parseFloat(item.sales_amount) - parseFloat(item.refund_amount)

                        this.commissionByService.totals.qty = parseInt(this.commissionByService.totals.qty) + parseInt(item.qty)
                        this.commissionByService.totals.sales_amount = parseFloat(this.commissionByService.totals.sales_amount) + parseFloat(item.sales_amount)
                        this.commissionByService.totals.refund_amount = parseFloat(this.commissionByService.totals.refund_amount) + parseFloat(item.refund_amount)
                        this.commissionByService.totals.sales_total += item.sales_total
                        this.commissionByService.totals.commission_total = parseFloat(this.commissionByService.totals.commission_total) + parseFloat(item.commission_total)
                    })

                    this.commissionByProduct.items.map(item => {
                        item.sales_total = parseFloat(item.sales_amount) - parseFloat(item.refund_amount)

                        this.commissionByProduct.totals.qty = parseInt(this.commissionByProduct.totals.qty) + parseInt(item.qty)
                        this.commissionByProduct.totals.sales_amount = parseFloat(this.commissionByProduct.totals.sales_amount) + parseFloat(item.sales_amount)
                        this.commissionByProduct.totals.refund_amount = parseFloat(this.commissionByProduct.totals.refund_amount) + parseFloat(item.refund_amount)
                        this.commissionByProduct.totals.sales_total += item.sales_total
                        this.commissionByProduct.totals.commission_total = parseFloat(this.commissionByProduct.totals.commission_total) + parseFloat(item.commission_total)
                    })

                    this.commissionByDeal.items.map(item => {
                        item.sales_total = parseFloat(item.sales_amount) - parseFloat(item.refund_amount)

                        this.commissionByDeal.totals.qty = parseInt(this.commissionByDeal.totals.qty) + parseInt(item.qty)
                        this.commissionByDeal.totals.sales_amount = parseFloat(this.commissionByDeal.totals.sales_amount) + parseFloat(item.sales_amount)
                        this.commissionByDeal.totals.refund_amount = parseFloat(this.commissionByDeal.totals.refund_amount) + parseFloat(item.refund_amount)
                        this.commissionByDeal.totals.sales_total += item.sales_total
                        this.commissionByDeal.totals.commission_total = parseFloat(this.commissionByDeal.totals.commission_total) + parseFloat(item.commission_total)
                    })
                    
                    this.dataLoader = false
                })
                .catch(() => {
                    this.dataLoader = false
                })
            },
            detailedQuery: function (staff_id, item_type) {
                let query = {}
                query.start_date = this.query.start_date
                query.end_date = this.query.end_date
                query.staff_id = staff_id
                query.item_type = item_type

                return query
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
            },
            staffs: function () {
                let staffs = []
                
                if (this.form.branch_id) {
                    this.branches.find(branch => branch.id == this.form.branch_id).staff.forEach(branchStaff => {
                        staffs.push({value: branchStaff.staff.id, text: branchStaff.staff.full_name})
                    })
                } else {
                    this.branches.forEach(branch => {
                        branch.staff.forEach(branchStaff => {
                            const doesStaffExist = staffs.find(staff => staff.value == branchStaff.staff.id)

                            if (!doesStaffExist) {
                                staffs.push({value: branchStaff.staff.id, text: branchStaff.staff.full_name})
                            }
                        })
                    })
                }

                return staffs
            }
        }
    }
</script>
<style lang="scss" scoped>
::v-deep .vue-daterange-picker{
    font-size: 12px;
    line-height: 1.9;
}

::v-deep .report-table{
    table{
        @media (max-width: 540px) {
               width: 540px;
            }
        }
    }
::v-deep .report-table1{
    table{
        @media (max-width: 1250px) {
               width: 1250px;
            }
        }
    }
</style>