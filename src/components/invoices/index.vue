<template>
    <b-container fluid>
        <overlay :show="showInvoiceLoader || showSaveInvoiceLoader || showDownloadInvoiceLoader" full-height>
            <template #overlay>
                <div class="text-center loading-content">
                    <b-spinner label="Spinning" style="width: 3rem; height: 3rem;"></b-spinner>
                    <p v-if="showSaveInvoiceLoader" class="mt-3 font-weight-bold">Saving your invoice. Please do not close this browser.</p>
                    <p v-if="showDownloadInvoiceLoader" class="mt-3 font-weight-bold">Downloading your invoice. Please do not close this browser.</p>
                </div>
            </template>
            <template v-if="!showInvoiceLoader">
                <b-row>
                    <b-col md="9" class="left-side p-0">
                        <div class="scrollable pt-5">
                            <div class="wrapper">
                                <div class="border-bottom pb-3 text-center">
                                    <p class="m-0 font-size-20">{{$store.getters.user.business.name}}</p>
                                    <p class="m-0 sub-color">{{invoice.branch.address}}</p>
                                    <p class="m-0 sub-color">+{{invoice.branch.business.country.phone_code}} {{invoice.branch.phone_number | VMask(invoice.branch.business.country.phone_mask)}}</p>
                                </div>
                                <div class="py-3 d-flex justify-content-between" style="line-height: 30px;">
                                    <div>
                                        <p class="m-0">
                                            <template v-if="invoice.client">
                                                <router-link :to="{name: 'clients.view', params: {id: invoice.client_id}}">{{invoice.client.full_name}}</router-link>
                                                <span class="d-block">+{{invoice.client.phone_country.phone_code}} {{invoice.client.phone_number | VMask(invoice.client.phone_country.phone_mask)}}</span>
                                                <span class="d-block" v-if="invoice.client.email">{{invoice.client.email}}</span>
                                            </template>
                                            <span v-else>Walk-In</span>
                                        </p>
                                    </div>
                                    <div class="text-right">
                                        <p class="m-0">Invoice #{{invoice.invoice_number}}</p>
                                        <p class="m-0">{{$helpers.formatDateTime(invoice.created_at)}}</p>
                                        <b-badge pill class="text-white" :variant="$helpers.invoiceStatusVariants(invoice.status)">{{invoice.status | uppercase}}</b-badge>
                                    </div>
                                </div>
                                <table class="table mt-2">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Item</th>
                                            <th class="text-right">Qty</th>
                                            <th class="text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item, idx in invoice.items" v-bind:key="'item-' + item.id">
                                            <td class="align-top">{{idx + 1}}</td>
                                            <td class="align-top">
                                                <p class="m-0">{{item.title}}</p>
                                                <p v-for="discount in item.discounts" v-bind:key="'discount' + discount.id" class="m-0 mt-1 sub-color">
                                                    {{discount.title}}
                                                </p>
                                                <p v-if="item.client_deal_id" class="m-0 mt-1 sub-color">
                                                    Deal: {{item.client_deal.deal.name}}
                                                </p>
                                            </td>
                                            <td class="text-right align-top">{{item.quantity}}</td>
                                            <td class="text-right align-top">
                                                <template v-if="item.discount > 0">
                                                    <p class="m-0">{{$store.getters.user.business.country.currency}} {{(item.price - item.discount) * item.quantity | currency}}</p>
                                                    <del class="mt-1 sub-color">{{$store.getters.user.business.country.currency}} {{item.price * item.quantity | currency}}</del>
                                                </template>
                                                <template v-else-if="item.client_deal_id">
                                                    <p class="m-0">{{$store.getters.user.business.country.currency}} {{(item.quantity - item.deal_quantity) * item.price | currency}}</p>
                                                    <del class="mt-1 sub-color">{{$store.getters.user.business.country.currency}} {{item.price * item.quantity | currency}}</del>
                                                </template>
                                                <p v-else class="m-0">
                                                    {{$store.getters.user.business.country.currency}} {{item.price * item.quantity | currency}}
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <b-row class="mt-4">
                                    <b-col></b-col>
                                    <b-col>
                                        <div v-if="taxes.length" class="d-flex justify-content-between mb-2">
                                            <p class="m-0">Subtotal</p>
                                            <p class="m-0 mr-3">{{$store.getters.user.business.country.currency}} {{subTotal | currency}}</p>
                                        </div>
                                        <div v-for="tax in taxes" v-bind:key="'tax-' + tax.id" class="d-flex justify-content-between mb-2">
                                            <p class="m-0">{{tax.title}} - {{tax.rate}}%</p>
                                            <p class="m-0 mr-3">{{$store.getters.user.business.country.currency}} {{tax.amount | currency}}</p>
                                        </div>
                                        <div class="d-flex justify-content-between font-size-17">
                                            <p class="m-0 font-weight-700">Total</p>
                                            <p class="m-0 mr-3 font-weight-700">{{$store.getters.user.business.country.currency}} {{grandTotal | currency}}</p>
                                        </div>
                                    </b-col>
                                </b-row>
                                <div v-if="invoice.notes" class="border-top font-italic font-size-14 mt-4 pt-2">
                                    {{invoice.notes}}
                                </div>
                            </div>
                        </div>
                    </b-col>
                    <b-col md="3" class="right-side bg-white border-left p-0 d-flex flex-column">
                        <div class="d-flex flex-column flex-grow-1">
                            <div class="p-4 border-bottom">
                                <div class="d-flex align-items-center">
                                    <template v-if="!invoice.client_id">
                                        <b-avatar size="3.5rem"></b-avatar>
                                        <p class="m-0 ml-3 font-size-17 font-weight-700">Walk-In</p>
                                    </template>
                                    <template v-else>
                                        <b-avatar variant="primary" :text="invoice.client.first_name[0] + invoice.client.last_name[0]" size="3.5rem" />
                                        <div class="d-flex flex-column ml-3">
                                            <p class="m-0 font-size-17 font-weight-700">
                                                {{invoice.client.full_name}}
                                            </p>
                                            <p class="mt-1 mb-1 font-size-15 sub-color">+{{invoice.client.phone_country.phone_code}} {{invoice.client.phone_number | VMask(invoice.client.phone_country.phone_mask)}}</p>
                                            <p class="m-0 font-size-15 sub-color">{{invoice.client.email}}</p>
                                        </div>
                                    </template>
                                </div>
                            </div>
                            <div v-if="payNow" class="p-4">
                                <b-row v-if="!invoice.payment_method_id">
                                    <b-col md="6" v-for="paymentMethod in paymentMethods" v-bind:key="'payment-method-' + paymentMethod.id" class="pl-2 pr-2 pb-3">
                                        <b-button @click="invoice.payment_method_id = paymentMethod.id" variant="outline-primary" block>{{paymentMethod.title}}</b-button>
                                    </b-col>
                                </b-row>
                                <div v-else class="d-flex flex-column text-center mt-4">
                                    <div class="d-flex justify-content-center">
                                        <span class="svg-wrapper wh-50 d-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 60"><path d="M27 47c-2.2 0-4-1.8-4-4 0-.6.4-1 1-1s1 .4 1 1c0 1.1.9 2 2 2s2-.9 2-2c0-1.5-2.3-2.2-2.3-2.2-.1 0-3.7-1.1-3.7-4.1 0-2.2 1.8-4 4-4s4 1.8 4 4c0 .6-.4 1-1 1s-1-.4-1-1c0-1.1-.9-2-2-2s-2 .9-2 2c0 1.5 2.3 2.2 2.3 2.2.1 0 3.7 1.1 3.7 4.1 0 2.2-1.8 4-4 4z" class="st0"></path><path d="M27 34.7c-.6 0-1-.4-1-1V32c0-.6.4-1 1-1s1 .4 1 1v1.7c0 .6-.4 1-1 1zM27 49c-.6 0-1-.4-1-1v-2c0-.6.4-1 1-1s1 .4 1 1v2c0 .6-.4 1-1 1zM32 20H15c-.6 0-1-.4-1-1s.4-1 1-1h17c.6 0 1 .4 1 1s-.4 1-1 1zM39 20h-3c-.6 0-1-.4-1-1s.4-1 1-1h3c.6 0 1 .4 1 1s-.4 1-1 1zM32 24H15c-.6 0-1-.4-1-1s.4-1 1-1h17c.6 0 1 .4 1 1s-.4 1-1 1zM39 24h-3c-.6 0-1-.4-1-1s.4-1 1-1h3c.6 0 1 .4 1 1s-.4 1-1 1zM32 28H15c-.6 0-1-.4-1-1s.4-1 1-1h17c.6 0 1 .4 1 1s-.4 1-1 1zM39 28h-3c-.6 0-1-.4-1-1s.4-1 1-1h3c.6 0 1 .4 1 1s-.4 1-1 1zM18 12h-3c-.6 0-1-.4-1-1s.4-1 1-1h3c.6 0 1 .4 1 1s-.4 1-1 1zM39 16H15c-.6 0-1-.4-1-1s.4-1 1-1h24c.6 0 1 .4 1 1s-.4 1-1 1zM40 7c0-.6.5-1 1-1s1 .4 1 1c0 .5-.5 1-1 1s-1-.5-1-1zm-4 0c0-.6.5-1 1-1s1 .4 1 1c0 .5-.5 1-1 1s-1-.5-1-1zm-4 0c0-.6.5-1 1-1s1 .4 1 1c0 .5-.5 1-1 1s-1-.5-1-1zm-4 0c0-.6.5-1 1-1s1 .4 1 1c0 .5-.5 1-1 1s-1-.5-1-1zm-4 0c0-.6.5-1 1-1s1 .4 1 1c0 .5-.5 1-1 1s-1-.5-1-1zm-4 0c0-.6.4-1 1-1 .5 0 1 .4 1 1 0 .5-.5 1-1 1-.6 0-1-.5-1-1zm-4 0c0-.6.4-1 1-1 .5 0 1 .4 1 1 0 .5-.5 1-1 1-.6 0-1-.5-1-1zm-4 0c0-.6.4-1 1-1 .5 0 1 .4 1 1 0 .5-.5 1-1 1-.6 0-1-.5-1-1zM40 53c0-.5.5-1 1-1s1 .5 1 1-.5 1-1 1-1-.5-1-1zm-4 0c0-.5.5-1 1-1s1 .5 1 1-.5 1-1 1-1-.5-1-1zm-4 0c0-.5.5-1 1-1s1 .5 1 1-.5 1-1 1-1-.5-1-1zm-4 0c0-.5.5-1 1-1s1 .5 1 1-.5 1-1 1-1-.5-1-1zm-4 0c0-.5.5-1 1-1s1 .5 1 1-.5 1-1 1-1-.5-1-1zm-4 0c0-.5.4-1 1-1 .5 0 1 .5 1 1s-.5 1-1 1c-.6 0-1-.5-1-1zm-4 0c0-.5.4-1 1-1 .5 0 1 .5 1 1s-.5 1-1 1c-.6 0-1-.5-1-1zm-4 0c0-.5.4-1 1-1 .5 0 1 .5 1 1s-.5 1-1 1c-.6 0-1-.5-1-1zM1 39c-.2 0-.3 0-.4-.1-.4-.2-.6-.5-.6-.9V5c0-2.8 2.2-5 5-5s5 2.2 5 5v31.5c0 .3-.1.6-.4.8l-2 1.5c-.4.3-.8.3-1.2 0L4 37l-2.4 1.8c-.2.1-.4.2-.6.2zm3-4.2c.2 0 .4.1.6.2L7 36.8l1-.8V5c0-1.7-1.3-3-3-3S2 3.3 2 5v31l1.4-1c.2-.2.4-.2.6-.2zm5 1.7z" class="st0"></path><path d="M45 60c-.2 0-.4-.1-.6-.2L42 58l-2.4 1.8c-.4.3-.8.3-1.2 0L36 58l-2.4 1.8c-.4.3-.8.3-1.2 0L30 58l-2.4 1.8c-.4.3-.8.3-1.2 0L24 58l-2.4 1.8c-.4.3-.8.3-1.2 0L18 58l-2.4 1.8c-.4.3-.8.3-1.2 0L12 58l-2.4 1.8c-.3.2-.7.3-1 .1-.4-.2-.6-.5-.6-.9V5c0-1.7-1.3-3-3-3-.6 0-1-.4-1-1s.4-1 1-1h36c2.8 0 5 2.2 5 5v54c0 .4-.2.7-.6.9-.1.1-.2.1-.4.1zm-9-4.2c.2 0 .4.1.6.2l2.4 1.8 2.4-1.8c.4-.3.8-.3 1.2 0l1.4 1V5c0-1.7-1.3-3-3-3H9c.6.8 1 1.9 1 3v52l1.4-1c.4-.3.8-.3 1.2 0l2.4 1.8 2.4-1.8c.4-.3.8-.3 1.2 0l2.4 1.8 2.4-1.8c.4-.3.8-.3 1.2 0l2.4 1.8 2.4-1.8c.4-.3.8-.3 1.2 0l2.4 1.8 2.4-1.8c.2-.2.4-.2.6-.2z" class="st0"></path></svg>
                                        </span>
                                    </div>
                                    <p class="m-0 mt-3 font-size-17">Full payment has been added</p>
                                    <b-button variant="primary" class="mt-5 mb-3" @click="saveInvoice()">Complete Sale</b-button>
                                    <b-link @click="invoice.payment_method_id = null">
                                        <b-icon-arrow-left></b-icon-arrow-left>
                                        Back to payments
                                    </b-link>
                                </div>
                            </div>
                            <div v-if="!payNow" class="d-flex flex-column align-items-center mt-5 ml-3 mr-3">
                                <template v-if="invoice.status === 'unpaid'">
                                    <span class="svg-wrapper wh-100 d-block">
                                        <img src="@/assets/images/unpaid.svg" />
                                    </span>
                                    <p class="m-0 mt-3 font-size-24 font-weight-700">Unpaid</p>
                                </template>
                                <template v-if="invoice.status === 'refunded'">
                                    <span class="svg-wrapper wh-100 d-block">
                                        <img src="@/assets/images/refunded.svg" />
                                    </span>
                                    <p class="m-0 mt-3 font-size-24 font-weight-700">Refunded</p>
                                </template>
                                <template v-if="invoice.status === 'completed'">
                                    <span class="svg-wrapper wh-100 d-block">
                                        <img src="@/assets/images/completed.svg" />
                                    </span>
                                    <p class="m-0 mt-3 font-size-24 font-weight-700">Completed</p>
                                </template>
                                <template v-if="invoice.status === 'voided'">
                                    <span class="svg-wrapper wh-100 d-block">
                                        <img src="@/assets/images/voided.svg" />
                                    </span>
                                    <p class="m-0 mt-3 font-size-24 font-weight-700">Voided</p>
                                </template>
                                <p v-if="invoice.status === 'voided'" class="mt-1 mb-0 font-size-17 text-center">Voided on {{$helpers.formatDate(invoice.void_created_at)}} at {{invoice.branch.name}}</p>
                                <p class="mt-4 mb-0 font-size-17 text-center" v-if="invoice.status === 'completed'">Full payment received on {{$helpers.formatDate(invoice.payment_created_at)}} at {{invoice.branch.name}}</p>
                                <p class="mt-4 mb-0 font-size-17 text-center" v-if="invoice.status === 'refunded'">Refund created on {{$helpers.formatDate(invoice.payment_created_at)}} at {{invoice.branch.name}} against <router-link :to="{name: 'view.invoice', params: {id: invoice.original_invoice_id}}">#{{invoice.original_invoice.invoice_number}}</router-link></p>
                                <p v-if="invoice.refund_invoice" class="mt-1 mb-0 text-center font-size-17">Refunded {{$helpers.formatDate(invoice.refund_invoice.payment_created_at)}} at {{invoice.branch.name}} with <router-link :to="{name: 'view.invoice', params: {id: invoice.refund_invoice.id}}">#{{invoice.refund_invoice.invoice_number}}</router-link></p>
                            </div>
                        </div>
                        <div class="p-3 border-top d-flex">
                            <div class="flex-basis-50 mr-2">
                                <dropdown dropup block text="More Options" class="box-shadow with-border" menu-class="w-100" variant="outline-transparent">
                                    <b-dropdown-item @click="downloadInvoice()">Download</b-dropdown-item>
                                    <b-dropdown-item @click="printInvoice()">Print</b-dropdown-item>
                                    <b-dropdown-item variant="danger" :to="{name: 'refund.invoice', params: {id: $route.params.id}}" v-if="invoice.status === 'completed'">Refund</b-dropdown-item>
                                    <b-dropdown-item variant="danger" @click="$refs['void-modal'].show()" v-if="invoice.status !== 'voided'">Void</b-dropdown-item>
                                </dropdown>
                            </div>
                            <b-button v-if="invoice.status === 'unpaid'" variant="primary" class="flex-basis-50 ml-2" @click="payNow = true">Pay now</b-button>
                            <router-link v-else :to="{name: 'calendar'}" class="btn btn-secondary flex-basis-50 ml-2">Close</router-link>
                        </div>
                    </b-col>
                </b-row>
                <b-modal v-if="invoice.status !== 'voided'" ref="void-modal" no-close-on-esc no-close-on-backdrop ok-only ok-title="Void Invoice" @ok="generateVoidInvoice()" title="Void Invoice">
                    <p class="m-0">Are you sure you want to void this invoice? This action is permanent and cannot be undone.</p>
                    <b-alert variant="info" show class="m-0 mt-3" v-if="invoice.status === 'completed'">
                        <p class="m-0">Following payments will be deleted</p>
                        {{$store.getters.user.business.country.currency}} {{invoice.grandtotal | currency}} paid by {{invoice.payment_method.title}} on {{$helpers.formatDate(invoice.payment_created_at)}}
                    </b-alert>
                </b-modal>
            </template>
        </overlay>
    </b-container>
</template>
<script>
    import Vue from "vue"
    import VMask from "v-mask"
    import Overlay from "../helpers/overlay.vue"
    import Dropdown from "../helpers/dropdown.vue"

    Vue.use(VMask)

    export default {
        components: {
            Overlay,
            Dropdown
        },
        data: function () {
            return {
                showInvoiceLoader: true,
                showSaveInvoiceLoader: false,
                showDownloadInvoiceLoader: false,
                invoice: {},
                payNow: false,
                paymentMethods: []
            }
        },
        watch: {
            $route: {
                handler: function () {
                    this.getInvoice()
                }
            }
        },
        created: async function () {
            await this.getInvoice()
        },
        computed: {
            subTotal: function () {
                let subTotal = 0
                this.invoice.items.forEach(item => {
                    subTotal += parseFloat((item.price - item.discount) * (item.quantity - item.deal_quantity >= 0 ? item.quantity - item.deal_quantity : 0))
                })
                if (subTotal > 0) {
                    if (this.invoice.is_tax_inclusive) {
                        subTotal -= this.taxTotal
                    }
                } else {
                    subTotal = 0
                }
                return subTotal
            },
            taxes: function () {
                let taxes = []
                this.invoice.items.forEach(item => {
                    item.taxes.forEach(tax => {
                        let taxRow = taxes.find(taxRow => taxRow.tax_id == tax.tax_id)
                        const taxAmount = tax.amount * (item.quantity - item.deal_quantity >= 0 ? item.quantity - item.deal_quantity : 0)
                        if (taxRow) {
                            taxRow.amount += taxAmount
                        } else {
                            taxes.push({ tax_id: tax.tax_id, title: tax.title, rate: tax.rate, amount: taxAmount })
                        }
                    })
                })
                return taxes
            },
            taxTotal: function () {
                let taxTotal = 0
                this.taxes.forEach(tax => {
                    taxTotal += tax.amount
                })
                return taxTotal
            },
            grandTotal: function () {
                return this.subTotal + this.taxTotal
            }
        },
        methods: {
            getInvoice: async function () {
                this.showInvoiceLoader = true
                const response = await this.$http.get("invoices/" + this.$route.params.id + "?with-client-deal&with-items&with-item-discounts&with-item-taxes&with-client&with-branch&with-payment-method&with-refund-invoice&with-original-invoice")
                this.invoice = response.data

                if (!this.paymentMethods.length) {
                    const paymentMethods = await this.$http.get("utilities/payment-methods/" + this.$store.getters.user.business.country_id + "?for_portal")
                    this.paymentMethods = paymentMethods.data
                }

                this.showInvoiceLoader = false
            },
            saveInvoice: function () {
                this.showSaveInvoiceLoader = true
                this.$http.put("invoices/complete-sale/" + this.$route.params.id, {
                    payment_method_id: this.invoice.payment_method_id
                })
                .then(response => {
                    this.showSaveInvoiceLoader = false
                    if (response.data.success) {
                        this.$helpers.showToast("success", response.data.message)
                    } else {
                        this.$helpers.showToast("danger", response.data.message)
                    }
                    this.payNow = false
                    this.getInvoice()
                })
                .catch((error) => {
                    this.$helpers.showToast("danger", error)
                    this.showSaveInvoiceLoader = false
                })
            },
            generateVoidInvoice: async function () {
                this.showSaveInvoiceLoader = true
                const response = await this.$http.put("invoices/void/" + this.$route.params.id)
                if (response.data.success) {
                    this.$helpers.showToast("success", response.data.message)
                    await this.getInvoice()
                    this.showSaveInvoiceLoader = false
                } else {
                    this.$helpers.showToast("danger", response.data.message)
                }
            },
            downloadInvoice: function () {
                this.showDownloadInvoiceLoader = true
                this.$http.get("invoices/download/" + this.$route.params.id, {responseType: "arraybuffer"})
                .then(response => {
                    const blob = new Blob([response.data], {type: "application/pdf"})
                    let link = document.createElement("a")
                    link.href = window.URL.createObjectURL(blob)
                    link.download = this.invoice.invoice_number + ".pdf"
                    link.click()
                })
                .finally(() => {
                    this.showDownloadInvoiceLoader = false
                })
            },
            printInvoice: function () {
                window.print()
            }
        }
    }
</script>
<style scoped lang="scss">
    @media (min-width: 992px) {
        .left-side {
            .scrollable {
                height: calc(100vh - 71px);
                overflow-y: scroll;
                .wrapper {
                    width: 60%;
                    margin: 0 auto;
                }
            }
        }
        .right-side {
            background: #000;
            height: calc(100vh - 71px);
            .scrollable {
                overflow-y: scroll;
                height: calc(100vh - 246px);
            }
        }
    }
</style>
<style lang="scss">
    @media print {
        aside,
        .right-side {
            display: none !important;
        }
    }
</style>