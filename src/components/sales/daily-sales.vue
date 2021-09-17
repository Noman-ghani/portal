<template>
    <div class="full-centralized">
        <b-row>
            <b-col md="3">
                <div class="form-control d-flex align-items-center">
                    <b-icon-calendar-fill class="mr-3"></b-icon-calendar-fill>
                    <date-range-picker @update="fetchData()" single-date-picker control-container-class="" :locale-data="{format: 'dddd dd mmmm yyyy'}" show-dropdowns v-model="form.dateRange"></date-range-picker>
                </div>
            </b-col>
        </b-row>
        <overlay :show="showLoader" full-height-with-heading>
            <template v-if="!showLoader">
                <b-row>
                    <b-col md="6" class="mt-4">
                        <b-card body-class="p-0">
                            <template #header>
                                <h2>Transaction Summary</h2>
                            </template>
                            <b-table :fields="transactionsSummary.fields" :items="transactionsSummary.items" class="daily-sale-card" responsive>
                                <template #cell(gross_total)="data">
                                    {{$store.getters.user.business.country.currency}} {{data.item.gross_total | currency}}
                                </template>
                                <template v-slot:custom-foot>
                                    <b-tr>
                                        <b-th>Total Sales</b-th>
                                        <b-th class="text-right">{{totalTransactionsSummary.sales_qty}} </b-th>
                                        <b-th class="text-right">{{totalTransactionsSummary.refund_qty}}</b-th>
                                        <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{totalTransactionsSummary.gross_total | currency}}</b-th>
                                    </b-tr>
                                </template>
                            </b-table>
                        </b-card>
                    </b-col>
                    <b-col md="6" class="mt-4">
                        <b-card body-class="p-0">
                            <template #header>
                                <h2>Cash Movement Summary</h2>
                            </template>
                            <b-table :fields="cashMovementSummary.fields" :items="cashMovementSummary.items" class="daily-sale-card" responsive>
                                <template #cell(payments_collected)="data">
                                    {{$store.getters.user.business.country.currency}} {{data.item.payments_collected | currency}}
                                </template>
                                <template #cell(refunds_paid)="data">
                                    - {{$store.getters.user.business.country.currency}} {{data.item.refunds_paid | currency}}
                                </template>
                                <template v-slot:custom-foot>
                                    <b-tr>
                                        <b-th>Payments collected</b-th>
                                        <b-th class="text-right">{{$store.getters.user.business.country.currency}} {{totalCashMovementSummary.payments_collected | currency}} </b-th>
                                        <b-th class="text-right">- {{$store.getters.user.business.country.currency}} {{totalCashMovementSummary.refunds_paid | currency}}</b-th>
                                    </b-tr>
                                </template>
                            </b-table>
                        </b-card>
                    </b-col>
                </b-row>
            </template>
        </overlay>
    </div>
</template>
<script>
    import "@/assets/css/_table.scss"
    import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

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
                showLoader: true,
                form: {
                    dateRange: {
                        startDate: moment(),
                        endDate: moment()
                    }
                },
                transactionsSummary: {
                    fields: [
                        { key: "type" },
                        { key: "sales_qty", thClass: "text-right", tdClass: "text-right" },
                        { key: "refund_qty", thClass: "text-right", tdClass: "text-right" },
                        { key: "gross_total", thClass: "text-right", tdClass: "text-right" },
                    ],
                    items: []
                },
                cashMovementSummary: {
                    fields: [
                        { key: "payment_type" },
                        { key: "payments_collected", thClass: "text-right", tdClass: "text-right" },
                        { key: "refunds_paid", thClass: "text-right", tdClass: "text-right" },
                    ],
                    items: []
                }
            }
        },
        created: function () {
            this.fetchData()
        },
        computed: {
            totalTransactionsSummary: function () {
                let totalTransactionsSummary = {
                    sales_qty: 0,
                    refund_qty: 0,
                    gross_total: 0
                }
                if (this.transactionsSummary.items) {
                    this.transactionsSummary.items.forEach(item => {
                        totalTransactionsSummary.sales_qty += parseInt(item.sales_qty)
                        totalTransactionsSummary.refund_qty += parseInt(item.refund_qty)
                        totalTransactionsSummary.gross_total += parseFloat(item.gross_total)
                    })
                }
                return totalTransactionsSummary
            },
            totalCashMovementSummary: function () {
                let totalCashMovementSummary = {
                    payments_collected: 0,
                    refunds_paid: 0
                }
                if (this.cashMovementSummary.items) {
                    this.cashMovementSummary.items.forEach(item => {
                        totalCashMovementSummary.payments_collected += parseFloat(item.payments_collected)
                        totalCashMovementSummary.refunds_paid += parseFloat(item.refunds_paid)
                    })
                }
                return totalCashMovementSummary
            }
        },
        methods: {
            fetchData: function () {
                this.showLoader = true
                this.$http.get("sales/daily-sales", {params: this.form})
                .then(response => {
                    this.transactionsSummary.items = response.data.transactionsSummary
                    this.cashMovementSummary.items = response.data.cashMovementSummary
                    this.showLoader = false
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
::v-deep .daily-sale-card{
    table{
        @media (max-width : 480px){
            width: 480px;
        }
    }
}
</style>