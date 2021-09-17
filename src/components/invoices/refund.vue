<template>
    <b-container fluid>
        <b-overlay :show="showInvoiceLoader || showSaveInvoiceLoader" class="full-height">
            <template #overlay>
                <div class="text-center loading-content">
                    <b-spinner label="Spinning" style="width: 3rem; height: 3rem;"></b-spinner>
                    <p class="mt-3 font-weight-bold">
                        <template v-if="showInvoiceLoader">Loading invoice details. Please wait</template>
                        <template v-else>Saving your invoice. Please do not close this browser.</template>
                    .</p>
                </div>
            </template>
            <b-row>
                <b-col md="9" class="d-flex left-side p-0">
                    <div class="d-flex align-items-start flex-grow-1 scrollable pt-5">
                        <div class="wrapper">
                            <ValidationObserver ref="form">
                                <b-form autocomplete="off">
                                    <b-card v-for="item, idx in invoice.items" v-bind:key="'item-' + idx" :class="{'mt-5': idx > 0}">
                                        <b-row>
                                            <b-col md="9">
                                                <p class="m-0 font-size-17 font-weight-700">{{item.title}}</p>
                                                <p class="m-0 mt-1 font-size-15 sub-color" v-html="item.description"></p>
                                            </b-col>
                                            <b-col md="2" class="text-right">
                                                <p class="m-0 font-size-17 font-weight-700">
                                                    -{{$store.getters.user.business.country.currency}} {{item.price * item.quantity | currency}}
                                                </p>
                                            </b-col>
                                            <b-col md="1" class="text-right">
                                                <b-icon-x variant="danger" font-scale="1.5" class="pointer" @click="invoice.items.splice(idx, 1)"></b-icon-x>
                                            </b-col>
                                        </b-row>
                                        <b-row class="mt-3">
                                            <b-col md="1">
                                                <b-form-group label="Qty" label-for="qty">
                                                    <b-form-input type="number" min="1" :max="item.original_quantity" v-model="item.quantity"></b-form-input>
                                                </b-form-group>
                                            </b-col>
                                            <b-col md="3">
                                                <b-form-group label="Price" label-for="price">
                                                    <b-input-group>
                                                        <template #prepend>
                                                            <b-input-group-text>{{$store.getters.user.business.country.currency}}</b-input-group-text>
                                                        </template>
                                                        <b-form-input type="number" v-model="item.price" disabled></b-form-input>
                                                    </b-input-group>
                                                </b-form-group>
                                            </b-col>
                                            <b-col md="4">
                                                <b-form-group label="Staff" label-for="staff">
                                                    <b-form-input disabled :value="item.staff_id ? item.staff.full_name : ''">No Discount</b-form-input>
                                                </b-form-group>
                                            </b-col>
                                            <b-col md="4">
                                                <b-form-group label="Discount" label-for="discount">
                                                    <b-form-input disabled :value="item.discounts[0] ? item.discounts[0].title : 'No Discount'"></b-form-input>
                                                </b-form-group>
                                            </b-col>
                                        </b-row>
                                    </b-card>
                                    <b-row class="mt-4">
                                        <b-col md="7"></b-col>
                                        <b-col md="5">
                                            <div class="d-flex justify-content-between font-size-17">
                                                <p class="m-0">Sub Total</p>
                                                <p class="m-0">-{{$store.getters.user.business.country.currency}} {{subTotal | currency}}</p>
                                            </div>
                                            <div v-for="tax, idx in taxes" v-bind:key="'tax-' + idx" class="d-flex justify-content-between font-size-17">
                                                <p class="m-0">{{tax.title}} ({{tax.rate}}%)</p>
                                                <p class="m-0">-{{$store.getters.user.business.country.currency}} {{tax.amount | currency}}</p>
                                            </div>
                                            <div class="d-flex justify-content-between font-size-20 font-weight-700 border-top mt-3 pt-3 pb-3">
                                                <p class="m-0">Amount Payable</p>
                                                <p class="m-0">-{{$store.getters.user.business.country.currency}} {{grandTotal | currency}}</p>
                                            </div>
                                        </b-col>
                                    </b-row>
                                </b-form>
                            </ValidationObserver>
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
                        <div class="p-4">
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
                                <p class="m-0 mt-3 font-size-17">Your invoice is ready to be refunded</p>
                                <b-button variant="primary" class="mt-5 mb-3" @click="saveInvoice()">Complete Sale</b-button>
                                <b-link @click="invoice.payment_method_id = null">
                                    <b-icon-arrow-left></b-icon-arrow-left>
                                    Back to payments
                                </b-link>
                            </div>
                        </div>
                    </div>
                    <div v-if="!invoice.payment_method_id" class="p-3 border-top">
                        <dropdown dropup block text="More Options" class="box-shadow with-border" menu-class="w-100" variant="outline-transparent">
                            <b-dropdown-item @click="$refs['invoice-details-modal'].show()">Invoice Details</b-dropdown-item>
                        </dropdown>
                    </div>
                </b-col>
            </b-row>
            <b-modal ref="invoice-details-modal" title="Invoice Details" no-close-on-esc no-close-on-backdrop ok-only ok-title="Save">
                <b-form-group label="Invoice notes" label-for="invoice-notes">
                    <b-form-textarea v-model="invoice.notes"></b-form-textarea>
                </b-form-group>
            </b-modal>
        </b-overlay>
    </b-container>
</template>
<script>
    import Dropdown from "../helpers/dropdown.vue"
    
    export default {
        components: {
            Dropdown
        },
        data: function () {
            return {
                showInvoiceLoader: true,
                showSaveInvoiceLoader: false,
                invoice: {},
                paymentMethods: []
            }
        },
        created: async function () {
            const invoiceResponse = await this.$http.get("invoices/" + this.$route.params.id + "?with-items&with-client&with-item-staff&with-item-discounts&with-item-taxes")
            this.invoice = invoiceResponse.data
            this.invoice.notes = null
            this.invoice.payment_method_id = null
            this.invoice.items.map(itemRow => {
                itemRow.price -= itemRow.discount
                itemRow.original_quantity = itemRow.quantity
            })

            const paymentMethodsResponse = await this.$http.get("utilities/payment-methods/" + this.$store.getters.user.business.country_id + "?for_portal=1")
            this.paymentMethods = paymentMethodsResponse.data

            this.showInvoiceLoader = false
        },
        computed: {
            subTotal: function () {
                let subTotal = 0
                if (this.invoice.items) {
                    this.invoice.items.forEach(cartRow => {
                        subTotal += parseFloat(cartRow.price * cartRow.quantity)
                    })
                }
                return subTotal
            },
            taxes: function () {
                let taxes = []
                if (this.invoice.items) {
                    this.invoice.items.forEach(cartRow => {
                        cartRow.taxes.forEach(taxRow => {
                            const taxLine = taxes.find(row => row.id == taxRow.id)
                            const taxAmount = ((cartRow.price * cartRow.quantity) * taxRow.rate) / 100
                            
                            if (!taxLine) {
                                taxes.push({id: taxRow.id, title: taxRow.title, rate: taxRow.rate, amount: taxAmount})
                            } else {
                                taxLine.amount += taxAmount
                            }
                        })
                    })
                }
                return taxes
            },
            taxTotal: function () {
                let taxTotal = 0
                this.taxes.forEach(taxRow => {
                    taxTotal += taxRow.amount
                })
                return taxTotal
            },
            grandTotal: function () {
                return this.subTotal + this.taxTotal
            }
        },
        methods: {
            saveInvoice: function () {
                this.showSaveInvoiceLoader = true
                this.$http.post("invoices/refund/" + this.$route.params.id, this.invoice)
                .then(response => {
                    this.showSaveInvoiceLoader = false
                    if (response.data.success) {
                        this.$helpers.showToast("success", response.data.message)
                        this.$router.push({name: "view.invoice", params: {id: response.data.invoice_id}})
                    } else {
                        this.$helpers.showToast("danger", response.data.message)
                    }
                })
                .catch(() => {
                    this.showSaveInvoiceLoader = false
                })
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
                    width: 85%;
                    margin: 0 auto;
                }
            }
        }
        .right-side {
            height: calc(100vh - 71px);
            .scrollable {
                overflow-y: scroll;
                height: calc(100vh - 246px);
            }
        }
    }
</style>