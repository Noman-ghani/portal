<template>
    <overlay :show="showLoader" full-height-with-heading>
        <template v-if="!showLoader">
            <router-link :to="{name: 'analytics.index'}"><b-icon-arrow-left></b-icon-arrow-left> Reports</router-link>
            <p class="mt-2 mb-3 font-size-24 font-weight-800">Staff Commission Detailed</p>
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
            <overlay :show="dataLoader" full-height-with-heading>
                <template v-if="!dataLoader">
                    <b-table hover :items="data.items" :fields="data.fields" class="mt-4 report-table" responsive>
                        <template #cell(invoice_date)="data">
                            {{$helpers.formatDateTime(data.item.invoice_date)}}
                        </template>
                        <template #cell(invoice_number)="data">
                            <router-link :to="{name: 'view.invoice', params: {id: data.item.invoice_id}}">{{data.item.invoice_number}}</router-link>
                        </template>
                        <template #cell(qty)="data">
                            <span v-if="data.item.invoice_status === 'refunded'">-</span>
                            {{data.item.qty}}
                        </template>
                        <template #cell(sale_value)="data">
                            <span v-if="data.item.invoice_status === 'refunded'">-</span>
                            {{$store.getters.user.business.country.currency}} {{data.item.sale_value}}
                        </template>
                        <template #cell(commission_rate)="data">
                            {{parseFloat(data.item.commission_rate)}}%
                        </template>
                        <template #cell(commission_amount)="data">
                            {{$store.getters.user.business.country.currency}} {{data.item.commission_amount}}
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
                        <b-form-group label="Item Type" label-for="item-type">
                            <b-form-select :options="types" v-model="form.item_type">
                                <template #first>
                                    <b-form-select-option :value="null">All Types</b-form-select-option>
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
                types: [
                    { value: "service", text: "Service" },
                    { value: "product", text: "Product" },
                    { value: "deal", text: "Deal" }
                ],
                data: {
                    fields: [
                        { key: "invoice_date", label: "Invoice Date" },
                        { key: "invoice_number", label: "Invoice No" },
                        { key: "staff", label: "Staff Member" },
                        { key: "item_sold" },
                        { key: "item_type" },
                        { key: "qty", thClass: "text-right", tdClass: "text-right" },
                        { key: "sale_value", thClass: "text-right", tdClass: "text-right" },
                        { key: "commission_rate", thClass: "text-right", tdClass: "text-right" },
                        { key: "commission_amount", thClass: "text-right", tdClass: "text-right" },
                    ],
                    items: []
                },
                form: {
                    branch_id: this.$route.query.branch_id ?? null,
                    staff_id: this.$route.query.staff_id ?? null,
                    item_type: this.$route.query.item_type ?? null,
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
                    item_type: null,
                    dateRange: {
                        startDate: moment().startOf("month"),
                        endDate: moment().endOf("month")
                    }
                }
            },
            fetchData: function () {
                history.pushState({}, null, this.$route.path + '?' + new URLSearchParams(this.query).toString())

                this.dataLoader = true
                this.$http.get("reports/staff-commission-detailed", {params: this.query})
                .then(response => {
                    this.data.items = response.data
                    this.dataLoader = false
                })
                .catch(() => {
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
        @media (max-width: 970px) {
               width: 970px;
            }
        }
    }
</style>