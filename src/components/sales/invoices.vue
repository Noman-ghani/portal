<template>
    <div class="full-centralized">
        <div class="d-flex">
            <div class="d-flex align-items-center form-control w-auto">
                <b-icon-calendar-fill class="mr-3"></b-icon-calendar-fill>
                <date-range-picker @update="fetchData()" control-container-class="" :locale-data="{firstDay: 1, format: 'mmmm dd, yyyy'}" show-dropdowns v-model="form.dateRange"></date-range-picker>
            </div>
        </div>
        <overlay :show="invoices.loader" full-height-with-heading-and-submenus class="mt-4">
            <template v-if="!invoices.loader">
                <b-table :fields="invoices.fields" :items="invoices.items" responsive class="invoice-table">
                    <template #top-row>
                        <b-th colspan="5">Total</b-th>
                        <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{totals.tax | currency}}</b-th>
                        <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{totals.grandtotal | currency}}</b-th>
                    </template>
                    <template #cell(invoice_number)="data">
                        <router-link :to="{name: 'view.invoice', params: {id: data.item.id}}">
                            {{data.item.invoice_number}}
                        </router-link>
                    </template>
                    <template #cell(client_id)="data">
                        <router-link v-if="data.item.client_id" :to="{name: 'clients.view', params: {id: data.item.client_id}}">
                            {{data.item.client.first_name}} {{data.item.client.last_name}}
                        </router-link>
                        <span v-else>Walk-In</span>
                    </template>
                    <template #cell(status)="data">
                        <b-badge pill :variant="$helpers.invoiceStatusVariants(data.item.status)" class="text-white">{{data.item.status | uppercase}}</b-badge>
                    </template>
                    <template #cell(created_at)="data">
                        {{$helpers.formatDate(data.item.created_at, "DD MMM YYYY")}}, {{$helpers.formatTime(data.item.created_at)}}
                    </template>
                    <template #cell(branch_id)="data">
                        {{data.item.branch.name}}
                    </template>
                    <template #cell(tax)="data">
                        <template v-if="data.item.status === 'refunded'">-</template> {{$store.getters.user.business.country.currency}} {{data.item.tax | currency}}
                    </template>
                    <template #cell(grandtotal)="data">
                        <template v-if="data.item.status === 'refunded'">-</template> {{$store.getters.user.business.country.currency}} {{data.item.grandtotal | currency}}
                    </template>
                </b-table>
            </template>
        </overlay>
    </div>
</template>
<script>
    import "@/assets/css/_table.scss"
    import moment from "moment"
    import DateRangePicker from "vue2-daterange-picker"
    import Overlay from "../helpers/overlay.vue"

    export default {
        components: {
            DateRangePicker,
            Overlay
        },
        data: function () {
            return {
                form: {
                    dateRange: {
                        startDate: moment().startOf("month"),
                        endDate: moment().endOf("month")
                    }
                },
                invoices: {
                    loader: false,
                    fields: [
                        { key: "invoice_number", label: "Invoice #" },
                        { key: "client_id", label: "Client" },
                        { key: "status", label: "Status" },
                        { key: "created_at", label: "Invoice Date" },
                        { key: "branch_id", label: "Location" },
                        { key: "tax", label: "Tax", thClass: "text-right", tdClass: "text-right" },
                        { key: "grandtotal", label: "Gross Total", thClass: "text-right", tdClass: "text-right" }
                    ],
                    items: []
                }
            }
        },
        created: function () {
            this.fetchData()
        },
        methods: {
            fetchData: function () {
                history.pushState({}, null, this.$route.path + '?' + new URLSearchParams(this.query).toString())

                this.invoices.loader = true
                this.$http.get("invoices", {params: this.query})
                .then(invoices => {
                    this.invoices.items = invoices.data
                    this.invoices.loader = false
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
            totals: function () {
                let totals = {
                    tax: 0,
                    grandtotal: 0
                }
                if (this.invoices.items) {
                    this.invoices.items.forEach(item => {
                        if (item.status === "completed") {
                            totals.tax += parseFloat(item.tax)
                            totals.grandtotal += parseFloat(item.grandtotal)
                        } else {
                            totals.tax -= parseFloat(item.tax)
                            totals.grandtotal -= parseFloat(item.grandtotal)
                        }
                    })
                }
                return totals
            }
        }
    }
</script>
<style lang="scss" scoped>
::v-deep .invoice-table{
    table{
        min-width: 900px;
    }
}
</style>