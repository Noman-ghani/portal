<template>
    <overlay :show="showLoader" full-height-with-heading>
        <template v-if="!showLoader">
            <router-link :to="{name: 'analytics.index'}"><b-icon-arrow-left></b-icon-arrow-left> Reports</router-link>
            <p class="mt-2 mb-3 font-size-24 font-weight-800">Sales by Service</p>
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
            <overlay :show="dataLoader" full-height-with-heading>
                <template v-if="!dataLoader">
                    <b-table class="mt-4 report-table" responsive hover :fields="data.fields" :items="data.items">
                        <template #top-row>
                            <b-th>Total</b-th>
                            <b-th class="text-right">{{data.totals.sales_qty}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{data.totals.gross_sales | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{data.totals.discounts | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{data.totals.refunds | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{data.totals.net_sales | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{data.totals.tax | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{data.totals.total_sales | currency}}</b-th>
                        </template>
                        <template #cell(gross_sales)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.gross_sales | currency}}
                        </template>
                        <template #cell(discounts)="data">
                            - {{$store.getters.user.business.country.currency}} {{data.item.discounts | currency}}
                        </template>
                        <template #cell(refunds)="data">
                            - {{$store.getters.user.business.country.currency}} {{data.item.refunds | currency}}
                        </template>
                        <template #cell(net_sales)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.net_sales | currency}}
                        </template>
                        <template #cell(tax)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.tax | currency}}
                        </template>
                        <template #cell(total_sales)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.total_sales | currency}}
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
                data: {
                    fields: [
                        {key: "service"},
                        {key: "sales_qty", thClass: "text-right", tdClass: "text-right"},
                        {key: "gross_sales", thClass: "text-right", tdClass: "text-right"},
                        {key: "discounts", thClass: "text-right", tdClass: "text-right"},
                        {key: "refunds", thClass: "text-right", tdClass: "text-right"},
                        {key: "net_sales", thClass: "text-right", tdClass: "text-right"},
                        {key: "tax", thClass: "text-right", tdClass: "text-right"},
                        {key: "total_sales", thClass: "text-right", tdClass: "text-right"}
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
                this.$http.get("reports/sales-by-service", {params: this.query})
                .then(response => {
                    this.data.items = response.data
                    this.data.totals = {
                        sales_qty: 0,
                        gross_sales: 0,
                        discounts: 0,
                        refunds: 0,
                        tax: 0
                    }

                    this.data.items.map(item => {
                        item.net_sales = parseFloat(item.gross_sales) - parseFloat(item.discounts) - parseFloat(item.refunds)
                        item.total_sales = parseFloat(item.net_sales) + parseFloat(item.tax)

                        this.data.totals.sales_qty = parseInt(this.data.totals.sales_qty) + parseInt(item.sales_qty)
                        this.data.totals.gross_sales = parseFloat(this.data.totals.gross_sales) + parseFloat(item.gross_sales)
                        this.data.totals.discounts = parseFloat(this.data.totals.discounts) + parseFloat(item.discounts)
                        this.data.totals.refunds = parseFloat(this.data.totals.refunds) + parseFloat(item.refunds)
                        this.data.totals.tax = parseFloat(this.data.totals.tax) + parseFloat(item.tax)
                    })

                    this.data.totals.net_sales = parseFloat(this.data.totals.gross_sales) - parseFloat(this.data.totals.discounts) - parseFloat(this.data.totals.refunds)
                    this.data.totals.total_sales = parseFloat(this.data.totals.net_sales) + parseFloat(this.data.totals.tax)

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
        @media (max-width: 920px) {
               width: 920px;
            }
        }
    }
</style>