<template>
    <overlay :show="showLoader" full-height-with-heading>
        <template v-if="!showLoader">
            <router-link :to="{name: 'analytics.index'}"><b-icon-arrow-left></b-icon-arrow-left> Reports</router-link>
            <p class="mt-2 mb-3 font-size-24 font-weight-800">Discounts Summary</p>
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
                    <p class="m-0 mt-4 font-size-24 font-weight-300">Discounts</p>
                    <b-table class="mt-2 report-table" responsive hover :items="discounts.items" :fields="discounts.fields">
                        <template #top-row>
                            <b-th>Total</b-th>
                            <b-th class="text-right">{{discounts.totals.items_discounted}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{discounts.totals.items_value | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{discounts.totals.discount_amount | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{discounts.totals.discount_refunds | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{discounts.totals.discount_amount - discounts.totals.discount_refunds | currency}}</b-th>
                        </template>
                        <template #cell(items_value)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.items_value | currency}}
                        </template>
                        <template #cell(discount_amount)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.discount_amount | currency}}
                        </template>
                        <template #cell(discount_refunds)="data">
                            - {{$store.getters.user.business.country.currency}} {{data.item.discount_refunds | currency}}
                        </template>
                        <template #cell(net_discounts)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.discount_amount - data.item.discount_refunds | currency}}
                        </template>
                    </b-table>
                    <p class="m-0 mt-5 font-size-24 font-weight-300">Discounts By Service</p>
                    <b-table class="mt-2 report-table" responsive hover :items="discountsByService.items" :fields="discountsByService.fields">
                        <template #top-row>
                            <b-th>Total</b-th>
                            <b-th class="text-right">{{discountsByService.totals.items_discounted}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{discountsByService.totals.items_value | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{discountsByService.totals.discount_amount | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{discountsByService.totals.discount_refunds | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{discountsByService.totals.discount_amount - discountsByService.totals.discount_refunds | currency}}</b-th>
                        </template>
                        <template #cell(items_value)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.items_value | currency}}
                        </template>
                        <template #cell(discount_amount)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.discount_amount | currency}}
                        </template>
                        <template #cell(discount_refunds)="data">
                            - {{$store.getters.user.business.country.currency}} {{data.item.discount_refunds | currency}}
                        </template>
                        <template #cell(net_discounts)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.discount_amount - data.item.discount_refunds | currency}}
                        </template>
                    </b-table>
                    <p class="m-0 mt-5 font-size-24 font-weight-300">Discounts By Product</p>
                    <b-table class="mt-2 report-table" responsive hover :items="discountsByProduct.items" :fields="discountsByProduct.fields">
                        <template #top-row>
                            <b-th>Total</b-th>
                            <b-th class="text-right">{{discountsByProduct.totals.items_discounted}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{discountsByProduct.totals.items_value | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{discountsByProduct.totals.discount_amount | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{discountsByProduct.totals.discount_refunds | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{discountsByProduct.totals.discount_amount - discountsByProduct.totals.discount_refunds | currency}}</b-th>
                        </template>
                        <template #cell(items_value)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.items_value | currency}}
                        </template>
                        <template #cell(discount_amount)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.discount_amount | currency}}
                        </template>
                        <template #cell(discount_refunds)="data">
                            - {{$store.getters.user.business.country.currency}} {{data.item.discount_refunds | currency}}
                        </template>
                        <template #cell(net_discounts)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.discount_amount - data.item.discount_refunds | currency}}
                        </template>
                    </b-table>
                    <p class="m-0 mt-5 font-size-24 font-weight-300">Discounts By Staff</p>
                    <b-table class="mt-2 report-table" responsive hover :items="discountsByStaff.items" :fields="discountsByStaff.fields">
                        <template #top-row>
                            <b-th>Total</b-th>
                            <b-th class="text-right">{{discountsByStaff.totals.items_discounted}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{discountsByStaff.totals.items_value | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{discountsByStaff.totals.discount_amount | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{discountsByStaff.totals.discount_refunds | currency}}</b-th>
                            <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{discountsByStaff.totals.discount_amount - discountsByStaff.totals.discount_refunds | currency}}</b-th>
                        </template>
                        <template #cell(items_value)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.items_value | currency}}
                        </template>
                        <template #cell(discount_amount)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.discount_amount | currency}}
                        </template>
                        <template #cell(discount_refunds)="data">
                            - {{$store.getters.user.business.country.currency}} {{data.item.discount_refunds | currency}}
                        </template>
                        <template #cell(net_discounts)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.discount_amount - data.item.discount_refunds | currency}}
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
                discounts: {
                    fields: [
                        { key: "discount" },
                        { key: "items_discounted", thClass: "text-right", tdClass: "text-right" },
                        { key: "items_value", thClass: "text-right", tdClass: "text-right" },
                        { key: "discount_amount", thClass: "text-right", tdClass: "text-right" },
                        { key: "discount_refunds", thClass: "text-right", tdClass: "text-right" },
                        { key: "net_discounts", thClass: "text-right", tdClass: "text-right" }
                    ],
                    items: [],
                    totals: {}
                },
                discountsByService: {
                    fields: [
                        { key: "service_name" },
                        { key: "items_discounted", thClass: "text-right", tdClass: "text-right" },
                        { key: "items_value", thClass: "text-right", tdClass: "text-right" },
                        { key: "discount_amount", thClass: "text-right", tdClass: "text-right" },
                        { key: "discount_refunds", thClass: "text-right", tdClass: "text-right" },
                        { key: "net_discounts", thClass: "text-right", tdClass: "text-right" }
                    ],
                    items: [],
                    totals: {}
                },
                discountsByProduct: {
                    fields: [
                        { key: "product_name" },
                        { key: "items_discounted", thClass: "text-right", tdClass: "text-right" },
                        { key: "items_value", thClass: "text-right", tdClass: "text-right" },
                        { key: "discount_amount", thClass: "text-right", tdClass: "text-right" },
                        { key: "discount_refunds", thClass: "text-right", tdClass: "text-right" },
                        { key: "net_discounts", thClass: "text-right", tdClass: "text-right" }
                    ],
                    items: [],
                    totals: {}
                },
                discountsByStaff: {
                    fields: [
                        { key: "staff_name" },
                        { key: "items_discounted", thClass: "text-right", tdClass: "text-right" },
                        { key: "items_value", thClass: "text-right", tdClass: "text-right" },
                        { key: "discount_amount", thClass: "text-right", tdClass: "text-right" },
                        { key: "discount_refunds", thClass: "text-right", tdClass: "text-right" },
                        { key: "net_discounts", thClass: "text-right", tdClass: "text-right" }
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
                this.$http.get("reports/discounts-summary", {params: this.query})
                .then(response => {
                    this.discounts.items = response.data.discounts
                    this.discountsByService.items = response.data.discountsByService
                    this.discountsByProduct.items = response.data.discountsByProduct
                    this.discountsByStaff.items = response.data.discountsByStaff

                    this.discounts.totals = {
                        items_discounted: 0,
                        items_value: 0,
                        discount_amount: 0,
                        discount_refunds: 0,
                        net_discounts: 0
                    }

                    this.discountsByService.totals = {
                        items_discounted: 0,
                        items_value: 0,
                        discount_amount: 0,
                        discount_refunds: 0,
                        net_discounts: 0
                    }

                    this.discountsByProduct.totals = {
                        items_discounted: 0,
                        items_value: 0,
                        discount_amount: 0,
                        discount_refunds: 0,
                        net_discounts: 0
                    }

                    this.discountsByStaff.totals = {
                        items_discounted: 0,
                        items_value: 0,
                        discount_amount: 0,
                        discount_refunds: 0,
                        net_discounts: 0
                    }
                    
                    this.discounts.items.forEach(item => {
                        this.discounts.totals.items_discounted = parseInt(this.discounts.totals.items_discounted) + parseInt(item.items_discounted)
                        this.discounts.totals.items_value = parseFloat(this.discounts.totals.items_value) + parseFloat(item.items_value)
                        this.discounts.totals.discount_amount = parseFloat(this.discounts.totals.discount_amount) + parseFloat(item.discount_amount)
                        this.discounts.totals.discount_refunds = parseFloat(this.discounts.totals.discount_refunds) + parseFloat(item.discount_refunds)
                    })
                    
                    this.discountsByService.items.forEach(item => {
                        this.discountsByService.totals.items_discounted = parseInt(this.discountsByService.totals.items_discounted) + parseInt(item.items_discounted)
                        this.discountsByService.totals.items_value = parseFloat(this.discountsByService.totals.items_value) + parseFloat(item.items_value)
                        this.discountsByService.totals.discount_amount = parseFloat(this.discountsByService.totals.discount_amount) + parseFloat(item.discount_amount)
                        this.discountsByService.totals.discount_refunds = parseFloat(this.discountsByService.totals.discount_refunds) + parseFloat(item.discount_refunds)
                    })
                    
                    this.discountsByProduct.items.forEach(item => {
                        this.discountsByProduct.totals.items_discounted = parseInt(this.discountsByProduct.totals.items_discounted) + parseInt(item.items_discounted)
                        this.discountsByProduct.totals.items_value = parseFloat(this.discountsByProduct.totals.items_value) + parseFloat(item.items_value)
                        this.discountsByProduct.totals.discount_amount = parseFloat(this.discountsByProduct.totals.discount_amount) + parseFloat(item.discount_amount)
                        this.discountsByProduct.totals.discount_refunds = parseFloat(this.discountsByProduct.totals.discount_refunds) + parseFloat(item.discount_refunds)
                    })
                    
                    this.discountsByStaff.items.forEach(item => {
                        this.discountsByStaff.totals.items_discounted = parseInt(this.discountsByStaff.totals.items_discounted) + parseInt(item.items_discounted)
                        this.discountsByStaff.totals.items_value = parseFloat(this.discountsByStaff.totals.items_value) + parseFloat(item.items_value)
                        this.discountsByStaff.totals.discount_amount = parseFloat(this.discountsByStaff.totals.discount_amount) + parseFloat(item.discount_amount)
                        this.discountsByStaff.totals.discount_refunds = parseFloat(this.discountsByStaff.totals.discount_refunds) + parseFloat(item.discount_refunds)
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
            },
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
        @media (max-width: 660px) {
               width: 660px;
            }
        }
    }
</style>